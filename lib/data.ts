import fs from 'fs';
import path from 'path';
import { getCmsCatalog } from './cms-data';

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
  colorFamilies: string[];
  dimensionGroups: string[];
  downloadFiles: {
    label: string;
    url: string;
  }[];
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

export function getCanonicalCategorySlug(categorySlug: string): string {
  if (categorySlug === 'vsetky') {
    return 'vsetky';
  }

  return getCategorySlugByName(resolveCategoryName(categorySlug));
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

// Color family mapping: keyword patterns → family label
const COLOR_FAMILY_MAP: [string, RegExp][] = [
  ['Biela',    /\b(bianc[oa]|white|neve|gesso|ivory|neutral|lacca.*bianc|lacquer.*white|lacquer.*bianc)\b/i],
  ['Čierna',   /\b(nero|black|pearl.?black)\b/i],
  ['Hnedá',    /\b(brown|corten|rust|castoro|cappuccino|tortora|taupe|impruneta)\b/i],
  ['Červená',  /\b(rosso|\bred\b|red.?clay|pompeian|terracotta|terra.*sien[ae]?|terr.*sien[ae]?|coral(?!.*sand))\b/i],
  ['Zelená',   /\b(verd[ei]|green|sage|oliv[ea]|origano|salv(?:ia|i|a)|emerald|mint|menta|rosemary|british)\b/i],
  ['Modrá',    /\b(blue|azzurr|acqua|aqua|aquamarina|provenza|night.?blue|maddalena)\b/i],
  ['Žltá',     /\b(yellow|giallo|sahara|ochre|gold(?:en)?)\b/i],
  ['Oranžová', /\b(orange|arancio)\b/i],
  ['Ružová',   /\b(pink|fuchsia|more.?di.?rovo|coral.?sand)\b/i],
  ['Sivá',     /\b(grey|gray|granite|cement|stone|pietr[a-z]*|lava|anthracit(?:e)?|antracit(?:e)?|ground|old.?stone)\b/i],
  ['Béžová',   /\b(beige|cret[ai]|sandy|grain|sand[^a]|decor|tide)\b/i],
];

function getColorFamilies(colors: { name: string }[]): string[] {
  const families = new Set<string>();
  for (const color of colors) {
    const name = color.name;
    for (const [family, pattern] of COLOR_FAMILY_MAP) {
      if (pattern.test(name)) {
        families.add(family);
      }
    }
  }
  return Array.from(families).sort((a, b) => a.localeCompare(b, 'sk'));
}

const DIMENSION_GROUPS = [
  { label: 'Do 50 cm', min: 0, max: 50 },
  { label: '51-100 cm', min: 50, max: 100 },
  { label: '101-150 cm', min: 100, max: 150 },
  { label: 'Nad 150 cm', min: 150, max: Infinity },
];

function getDimensionValues(dimension: string): number[] {
  const matches = dimension
    .replace(/\u00a0/g, ' ')
    .replace(/,/g, '.')
    .match(/\d+(?:\.\d+)?/g);

  return (matches || [])
    .map(value => Number(value))
    .filter(value => Number.isFinite(value));
}

function getDimensionGroups(dimensions: string[]): string[] {
  const groups = new Set<string>();

  for (const dimension of dimensions) {
    const values = getDimensionValues(dimension);
    if (values.length === 0) {
      continue;
    }

    // Use the largest side so long or tall products land in the larger range.
    const largestSide = Math.max(...values);
    for (const group of DIMENSION_GROUPS) {
      if (largestSide > group.min && largestSide <= group.max) {
        groups.add(group.label);
      }
    }
  }

  return DIMENSION_GROUPS
    .map(group => group.label)
    .filter(label => groups.has(label));
}

let productDownloadsCache: Record<string, { label: string; url: string }[]> | null = null;

function getProductDownloads(slug: string): { label: string; url: string }[] {
  if (!productDownloadsCache) {
    try {
      const filePath = path.join(process.cwd(), 'data', 'e3p_downloads_supabase.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const rawData = JSON.parse(fileContents);
      productDownloadsCache = {};
      for (const [key, files] of Object.entries(rawData)) {
        if (Array.isArray(files)) {
          productDownloadsCache[key] = files.map((f: { label?: string; url?: string }) => ({
            label: f.label || 'Technický dokument',
            url: f.url || '',
          })).filter(f => f.url);
        }
      }
    } catch {
      productDownloadsCache = {};
    }
  }

  return productDownloadsCache[slug] || [];
}

function normalizeProduct(product: ScrapedProduct): Product {
  const images = (product.local_images || [])
    .map(toPublicImagePath)
    .filter(Boolean);
  const brands = getProductBrands(product.slug);

  const rawDescription = product.long_description || product.short_description || '';
  let description = cleanDescription(rawDescription);
  let shortDescription = cleanDescription(product.short_description || '');

  const supplierIndex = description.toLowerCase().indexOf('pre viac inform');
  if (supplierIndex !== -1) {
    const textBefore = description.substring(0, supplierIndex).trim();
    const textAfter = description.substring(supplierIndex).trim();
    description = textBefore;
    shortDescription = textAfter;
  }

  const variationDimensions = product.variations && product.variations.length > 0
    ? Array.from(new Set(product.variations.map(v => v.attributes.rozmer || v.attributes.size).filter(Boolean)))
    : [];

  const dimensions = variationDimensions.length > 0
    ? variationDimensions
    : extractDimensionsFromText(rawDescription);

  const colors = (product.colors || [])
    .map(c => ({
      name: c.name,
      code: c.code,
      hex: c.hex,
      image: c.image
    }))
    .filter(c => !/\d+\s*(x|×)\s*\d+/i.test(c.name));

  return {
    id: product.slug,
    slug: product.slug,
    name: product.title,
    url: product.url,
    price: product.price || 'Cena na vyžiadanie',
    brand: brands[0] || 'KOCHLIK',
    brands,
    categories: product.categories || [],
    shortDescription,
    description,
    attributes: product.attributes || {},
    images,
    variations: (product.variations || []).map(v => ({
      attributes: v.attributes || {},
      price: v.price,
      variationId: v.variation_id
    })),
    colors,
    dimensions,
    colorFamilies: getColorFamilies(colors),
    dimensionGroups: getDimensionGroups(dimensions),
    downloadFiles: getProductDownloads(product.slug)
  };
}


function getStaticCatalog(): Product[] {
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

export async function getCatalog(): Promise<Product[]> {
  const staticCatalog = getStaticCatalog();
  const cmsCatalog = await getCmsCatalog();
  if (!cmsCatalog) {
    return staticCatalog;
  }

  const productsBySlug = new Map(staticCatalog.map(product => [product.slug, product]));
  for (const product of cmsCatalog) {
    const staticProduct = productsBySlug.get(product.slug);
    productsBySlug.set(product.slug, {
      ...staticProduct,
      ...product,
      images: product.images.length > 0 ? product.images : staticProduct?.images || [],
      downloadFiles: product.downloadFiles,
    });
  }

  return Array.from(productsBySlug.values()).sort((a, b) => a.name.localeCompare(b.name, 'sk'));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const catalog = await getCatalog();
  return catalog.find(product => product.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const catalog = await getCatalog();
  if (categorySlug === 'vsetky') {
    return catalog;
  }

  const categoryName = resolveCategoryName(categorySlug);

  return catalog.filter(product => {
    const cats = product.categories || [];
    return cats.some(c => c === categoryName);
  });
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const primaryCategory = product.categories[0];
  const catalog = await getCatalog();
  return catalog
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
