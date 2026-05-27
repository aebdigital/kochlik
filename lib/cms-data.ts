import type { Product } from './data';

const KOCHLIK_OWNER_ID = 'c28707c3-2289-48b9-bbd3-08a441fd02fc';

type CmsCategory = {
  id: string;
  name: string;
  slug: string;
};

type CmsProduct = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  sku: string | null;
  brand: string | null;
  price_text: string | null;
  price_cents: number | null;
  currency: string;
  short_description: string | null;
  description: string | null;
  main_image_url: string | null;
  gallery_images: string[] | null;
  color_options: {
    name?: string;
    family?: string;
    hex?: string;
    image_url?: string;
  }[] | null;
  color_families: string[] | null;
  dimensions: string[] | null;
  dimension_groups: string[] | null;
  variations: {
    label?: string;
    sku?: string;
    dimensions?: string;
    price?: string;
    price_cents?: number | null;
  }[] | null;
  specifications: { key?: string; value?: string }[] | null;
  download_files: { label?: string; url?: string }[] | null;
  supplier_url: string | null;
  source_url: string | null;
  kochlik_categories?: CmsCategory | null;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ''),
    anonKey,
  };
}

function formatPrice(product: CmsProduct): string {
  if (product.price_text) {
    return product.price_text;
  }

  if (product.price_cents == null) {
    return 'Cena na vyžiadanie';
  }

  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: product.currency || 'EUR',
  }).format(product.price_cents / 100);
}

function mapCmsProduct(product: CmsProduct): Product {
  const categoryName = product.kochlik_categories?.name;
  const images = [
    product.main_image_url,
    ...(product.gallery_images || []),
  ].filter(Boolean) as string[];
  const uniqueImages = Array.from(new Set(images));

  const colors = (product.color_options || [])
    .map(color => ({
      name: color.name || '',
      hex: color.hex || undefined,
      image: color.image_url || undefined,
    }))
    .filter(color => color.name);

  const variations = (product.variations || []).map(variation => {
    const dimension = variation.dimensions || variation.label || '';
    const price = variation.price || (
      variation.price_cents == null
        ? formatPrice(product)
        : new Intl.NumberFormat('sk-SK', {
            style: 'currency',
            currency: product.currency || 'EUR',
          }).format(variation.price_cents / 100)
    );

    return {
      attributes: {
        ...(dimension ? { rozmer: dimension } : {}),
        ...(variation.label ? { label: variation.label } : {}),
        ...(variation.sku ? { sku: variation.sku } : {}),
      },
      price,
    };
  });

  const dimensions = product.dimensions || [];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    url: product.supplier_url || product.source_url || `/produkt/${product.slug}`,
    price: formatPrice(product),
    brand: product.brand || 'KOCHLIK',
    brands: product.brand ? [product.brand] : ['KOCHLIK'],
    categories: categoryName ? [categoryName] : [],
    shortDescription: product.short_description || '',
    description: product.description || product.short_description || '',
    attributes: {
      ...(product.sku ? { SKU: product.sku } : {}),
      ...(dimensions.length > 0 ? { Rozmer: dimensions.join(', ') } : {}),
    },
    images: uniqueImages,
    variations,
    colors,
    dimensions,
    colorFamilies: (product.color_families || []).sort((a, b) => a.localeCompare(b, 'sk')),
    dimensionGroups: product.dimension_groups || [],
    downloadFiles: (product.download_files || [])
      .map(file => ({
        label: file.label || 'Technický dokument',
        url: file.url || '',
      }))
      .filter(file => file.url),
  };
}

export async function getCmsCatalog(): Promise<Product[] | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const params = new URLSearchParams({
    select: '*,kochlik_categories(id,name,slug)',
    owner_id: `eq.${KOCHLIK_OWNER_ID}`,
    is_active: 'eq.true',
    order: 'sort_order.asc,updated_at.desc',
  });

  try {
    const response = await fetch(`${config.url}/rest/v1/kochlik_products?${params.toString()}`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
      next: {
        revalidate: 86400,
        tags: ['cms-catalog'],
      },
    });

    if (!response.ok) {
      return null;
    }

    const products = await response.json() as CmsProduct[];

    if (products.length === 0) {
      return null;
    }

    return products
      .map(mapCmsProduct)
      .sort((a, b) => a.name.localeCompare(b.name, 'sk'));
  } catch {
    return null;
  }
}
