import fs from 'fs';
import path from 'path';

interface ScrapedProduct {
  title: string;
  url: string;
  slug: string;
  price: string;
  short_description?: string;
  long_description?: string;
  attributes?: Record<string, string>;
  categories?: string[];
  image_urls?: string[];
  local_images?: string[];
  variations?: {
    attributes: Record<string, string>;
    price: string;
    variation_id?: number;
  }[];
  colors?: {
    name: string;
    code?: string;
    hex?: string;
    image?: string;
  }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  url: string;
  price: string;
  brand: string;
  brands: string[];
  categories: string[];
  shortDescription: string;
  description: string;
  attributes: Record<string, string>;
  images: string[];
  variations: {
    attributes: Record<string, string>;
    price: string;
    variationId?: number;
  }[];
  colors: {
    name: string;
    code?: string;
    hex?: string;
    image?: string;
  }[];
  dimensions: string[];
}

export const categoryLinks = [
  { name: 'Dizajnové', slug: 'dizajnove', category: 'Dizajnové kvetináče' },
  { name: 'Moderné', slug: 'moderne-kvetinace', category: 'Moderné kvetináče' },
  { name: 'Klasické', slug: 'klasicke-kvetinace', category: 'Klasické kvetináče' },
  { name: 'Svietiace', slug: 'svietiace-kvetinace', category: 'Svietiace kvetináče' },
  { name: 'Nábytok', slug: 'nabytok', category: 'Nábytok' },
  { name: 'Doplnky', slug: 'doplnky', category: 'Doplnky' },
];

export const categoryDescriptions: Record<string, string> = {
  dizajnove:
    'Ak sa radi prezentujete moderne, dizajnové kvetináče by vo vašej domácnosti nemali chýbať. Vášmu domovu, záhrade alebo firme dodajú osobitný charakter a ich nezvyčajné tvary pôsobia výnimočne.',
  moderne:
    'Moderné kvetináče sú určené pre interiéry a exteriéry, kde má čistý tvar, odolný materiál a praktické používanie rovnakú dôležitosť ako samotný vzhľad.',
  klasicke:
    'Klasické kvetináče nadväzujú na tradičné tvary, ktoré sa hodia do záhrad, dvorov a reprezentatívnych priestorov s nadčasovou atmosférou.',
  svietiace:
    'Svietiace kvetináče a doplnky vytvárajú jemnú večernú atmosféru na terasách, v hoteloch, reštauráciách aj moderných domácnostiach.',
  nabytok:
    'Taliansky exteriérový a interiérový nábytok dopĺňa kolekciu kvetináčov o kreslá, stoly, sedačky a ďalšie výrazné dizajnové prvky.',
  doplnky:
    'Doplnky dotvárajú priestor a pomáhajú zjednotiť záhradu, terasu alebo interiér do jedného premysleného celku.',
};

export const categoryAliases: Record<string, string> = {
  dizajnove: 'Dizajnové kvetináče',
  'dizajnove-kvetinace': 'Dizajnové kvetináče',
  moderne: 'Moderné kvetináče',
  'moderne-kvetinace': 'Moderné kvetináče',
  klasicke: 'Klasické kvetináče',
  'klasicke-kvetinace': 'Klasické kvetináče',
  svietiace: 'Svietiace kvetináče',
  'svietiace-kvetinace': 'Svietiace kvetináče',
  nabytok: 'Nábytok',
  doplnky: 'Doplnky',
  kvetinace: 'Kvetináče',
};

export function resolveCategoryName(categorySlug: string): string {
  if (categorySlug === 'vsetky') {
    return 'Všetky produkty';
  }

  const link = categoryLinks.find(item => item.slug === categorySlug);
  return link?.category || categoryAliases[categorySlug] || categorySlug;
}

export function getCategoryDescription(categorySlug: string): string {
  const categoryName = resolveCategoryName(categorySlug);
  const link = categoryLinks.find(item => item.category === categoryName);
  const descriptionKey = link?.slug || categorySlug;
  const simpleDescriptionKey = descriptionKey.replace('-kvetinace', '');

  return (
    categoryDescriptions[categorySlug] ||
    categoryDescriptions[descriptionKey] ||
    categoryDescriptions[simpleDescriptionKey] ||
    'Vyberte si z kolekcie kvalitných talianskych produktov pre interiér, exteriér a reprezentatívne priestory.'
  );
}

export function getCategorySlugByName(categoryName: string): string {
  return categoryLinks.find(item => item.category === categoryName)?.slug || 'vsetky';
}

function toPublicImagePath(localPath: string): string {
  if (!localPath) {
    return '';
  }

  if (localPath.startsWith('/')) {
    return localPath;
  }

  return `/${localPath.replace(/^scraped_catalog\//, '')}`;
}

let productBrandsCache: Record<string, string[]> | null = null;

function getProductBrands(slug: string): string[] {
  if (!productBrandsCache) {
    try {
      const filePath = path.join(process.cwd(), 'data', 'product_brands.json');
      productBrandsCache = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, string[]>;
    } catch {
      productBrandsCache = {};
    }
  }

  return productBrandsCache[slug] || [];
}

function extractDimensionsFromText(description: string): string[] {
  if (!description) return [];
  
  // 1. Look for Rozmer on the same line, e.g. "Rozmer: 39 x 38 x 74 cm"
  const sameLineMatch = description.match(/rozmer[a-z]*\s*:\s*(\d+[^?\n\r]+)/i);
  if (sameLineMatch) {
    const val = sameLineMatch[1].replace(/\u00a0/g, ' ').trim();
    if (val && !val.includes('Pre viac') && !val.includes('http') && val.length < 50) {
      return [val];
    }
  }
  
  // 2. Look for Rozmer on a separate line
  const lines = description.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^rozmer[a-z]*[:\s\-]*$/i.test(line)) {
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (/\d+/.test(nextLine) && nextLine.length < 50 && !nextLine.includes('http')) {
          const cleaned = nextLine.replace(/\u00a0/g, ' ').trim();
          return [cleaned];
        }
      }
    }
  }
  
  return [];
}

function cleanDescription(description: string): string {
  if (!description) return '';
  
  const lines = description.split('\n');
  const newLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^rozmer[a-z]*[:\s\-]*$/i.test(line)) {
      if (i + 1 < lines.length && /\d+/.test(lines[i + 1])) {
        i++; // skip next line (the dimensions line)
        continue;
      }
    }
    if (/^rozmer[a-z]*\s*:\s*\d+/i.test(line)) {
      continue;
    }
    newLines.push(lines[i]);
  }
  
  return newLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function normalizeProduct(product: ScrapedProduct): Product {
  const images = (product.local_images || [])
    .map(toPublicImagePath)
    .filter(Boolean);
  const brands = getProductBrands(product.slug);

  const rawDescription = product.long_description || product.short_description || '';
  const hasPriceVariations = product.variations && product.variations.length > 0;
  
  const variationDimensions = product.variations && product.variations.length > 0
    ? Array.from(new Set(product.variations.map(v => v.attributes.rozmer || v.attributes.size).filter(Boolean)))
    : [];

  const dimensions = variationDimensions.length > 0
    ? variationDimensions
    : extractDimensionsFromText(rawDescription);

  return {
    id: product.slug,
    slug: product.slug,
    name: product.title,
    url: product.url,
    price: product.price || 'Cena na vyžiadanie',
    brand: brands[0] || 'KOCHLIK',
    brands,
    categories: product.categories || [],
    shortDescription: cleanDescription(product.short_description || ''),
    description: cleanDescription(rawDescription),
    attributes: product.attributes || {},
    images,
    variations: (product.variations || []).map(v => ({
      attributes: v.attributes || {},
      price: v.price,
      variationId: v.variation_id
    })),
    colors: (product.colors || [])
      .map(c => ({
        name: c.name,
        code: c.code,
        hex: c.hex,
        image: c.image
      }))
      .filter(c => !/\d+\s*(x|×)\s*\d+/i.test(c.name)),
    dimensions
  };
}

export function getCatalog(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'master_catalog.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileContents) as ScrapedProduct[];
    return products
      .map(normalizeProduct)
      .sort((a, b) => a.name.localeCompare(b.name, 'sk'));
  } catch (error) {
    console.error("Error reading catalog:", error);
    return [];
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  const catalog = getCatalog();
  return catalog.find(product => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const catalog = getCatalog();
  if (categorySlug === 'vsetky') {
    return catalog;
  }

  const categoryName = resolveCategoryName(categorySlug);

  return catalog.filter(product => {
    const cats = product.categories || [];
    return cats.some(c => c === categoryName);
  });
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const primaryCategory = product.categories[0];
  return getCatalog()
    .filter(item => item.slug !== product.slug)
    .filter(item => !primaryCategory || item.categories.includes(primaryCategory))
    .slice(0, limit);
}

export function getBrandsForProducts(products: Product[]): string[] {
  return Array.from(
    new Set(
      products
        .flatMap(product => (product.brands.length > 0 ? product.brands : [product.brand]))
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, 'sk'));
}
