#!/usr/bin/env node
/**
 * Generate seed_kochlik_products.sql from kochlik-nextjs/data/master_catalog.json.
 *
 * Output:
 *   kochlik-nextjs/data/seed_kochlik_products.sql        (review copy)
 *   cms/aeb_cms/sql/seed_kochlik_products.sql            (run from Supabase SQL Editor)
 *
 * The static master_catalog.json is left untouched.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CMS_SQL_DIR = path.resolve(ROOT, '..', '..', 'cms', 'aeb_cms', 'sql');

const OWNER_ID = 'c28707c3-2289-48b9-bbd3-08a441fd02fc';

// Category name -> seeded slug (must match create_kochlik_products.sql)
const CATEGORY_NAME_TO_SLUG = {
  'Dizajnové kvetináče': 'dizajnove',
  'Moderné kvetináče': 'moderne-kvetinace',
  'Klasické kvetináče': 'klasicke-kvetinace',
  'Svietiace kvetináče': 'svietiace-kvetinace',
  'Nábytok': 'nabytok',
  'Doplnky': 'doplnky',
  // "Kvetináče" has no dedicated seeded category -> category_id stays NULL.
};

const COLOR_FAMILY_MAP = [
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

const DIMENSION_GROUPS = [
  { label: 'Do 50 cm', min: 0, max: 50 },
  { label: '51-100 cm', min: 50, max: 100 },
  { label: '101-150 cm', min: 100, max: 150 },
  { label: 'Nad 150 cm', min: 150, max: Infinity },
];

function colorFamilyFor(name) {
  for (const [family, pattern] of COLOR_FAMILY_MAP) {
    if (pattern.test(name)) return family;
  }
  return null;
}

function getColorFamilies(colors) {
  const families = new Set();
  for (const c of colors) {
    const f = colorFamilyFor(c.name || '');
    if (f) families.add(f);
  }
  return [...families].sort((a, b) => a.localeCompare(b, 'sk'));
}

function getDimensionValues(text) {
  const matches = String(text)
    .replace(/ /g, ' ')
    .replace(/,/g, '.')
    .match(/\d+(?:\.\d+)?/g);
  return (matches || []).map(Number).filter(Number.isFinite);
}

function getDimensionGroups(dimensions) {
  const groups = new Set();
  for (const d of dimensions) {
    const values = getDimensionValues(d);
    if (!values.length) continue;
    const largest = Math.max(...values);
    for (const group of DIMENSION_GROUPS) {
      if (largest > group.min && largest <= group.max) groups.add(group.label);
    }
  }
  return DIMENSION_GROUPS.map(g => g.label).filter(label => groups.has(label));
}

function extractDimensionsFromText(text) {
  // Look for things like 60 x 60 x 31 cm, 24×20 cm
  const re = /\d+\s*(?:[x×]\s*\d+){0,2}\s*cm/gi;
  return (text.match(re) || []).map(s => s.trim());
}

function priceCents(priceText) {
  if (!priceText) return null;
  const firstNumber = priceText.split(/[–-]/)[0] ?? '';
  const normalized = firstNumber.replace(/[^\d.]/g, '');
  if (!normalized) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100);
}

function cleanDescription(text) {
  if (!text) return '';
  return String(text).trim();
}

function extractSupplierUrl(...texts) {
  for (const text of texts) {
    const match = String(text || '').match(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/i);
    if (match?.[1]) return match[1];
  }
  return null;
}

const IMAGE_HOST = 'https://kochlik.netlify.app';

function toPublicImagePath(local) {
  if (!local) return null;
  if (local.startsWith('http://') || local.startsWith('https://')) return local;
  const path = local.startsWith('/') ? local : `/${local.replace(/^scraped_catalog\//, '')}`;
  return `${IMAGE_HOST}${path}`;
}

// SQL helpers
function sqlText(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlInt(value) {
  if (value === null || value === undefined) return 'NULL';
  return String(Math.trunc(value));
}

function sqlBool(value) {
  return value ? 'TRUE' : 'FALSE';
}

function sqlTextArray(values) {
  if (!values || values.length === 0) return `ARRAY[]::text[]`;
  const escaped = values.map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ');
  return `ARRAY[${escaped}]::text[]`;
}

function sqlJsonb(value) {
  const json = JSON.stringify(value ?? []);
  return `'${json.replace(/'/g, "''")}'::jsonb`;
}

function sqlCategoryLookup(categoryName) {
  const slug = CATEGORY_NAME_TO_SLUG[categoryName];
  if (!slug) return 'NULL';
  return `(SELECT id FROM public.kochlik_categories WHERE owner_id = '${OWNER_ID}'::uuid AND slug = '${slug}' LIMIT 1)`;
}

function buildProductRow(product, brands, downloadsBySlug) {
  const slug = product.slug;
  const name = product.title;
  const rawDescription = product.long_description || product.short_description || '';
  const description = cleanDescription(rawDescription);
  const shortDescription = cleanDescription(product.short_description || '');

  const productBrands = brands[slug] || [];
  const brand = productBrands[0] || 'KOCHLIK';

  // Images live on the Netlify-hosted storefront. toPublicImagePath() prefixes the host
  // so the URLs work in the CMS and any other client.
  const galleryImages = (product.local_images || []).map(toPublicImagePath).filter(Boolean);
  const mainImage = galleryImages[0] || null;

  const variations = product.variations || [];
  const variationDimensions = variations.length > 0
    ? [...new Set(variations.map(v => (v.attributes?.rozmer || v.attributes?.size)).filter(Boolean))]
    : [];
  const dimensions = variationDimensions.length > 0
    ? variationDimensions
    : extractDimensionsFromText(rawDescription);

  const colors = (product.colors || [])
    .map(c => ({
      name: c.name || '',
      hex: c.hex || null,
      image_url: c.image ? toPublicImagePath(c.image) : null,
      family: colorFamilyFor(c.name || ''),
    }))
    .filter(c => !/\d+\s*(x|×)\s*\d+/i.test(c.name));

  const colorFamilies = getColorFamilies(colors);
  const dimensionGroups = getDimensionGroups(dimensions);

  const variationsJson = variations.map(v => ({
    label: v.attributes?.rozmer || v.attributes?.size || null,
    dimensions: v.attributes?.rozmer || v.attributes?.size || null,
    price_cents: priceCents(v.price),
    attributes: v.attributes || {},
  }));

  const specifications = Object.entries(product.attributes || {}).map(([label, value]) => ({
    key: label,
    value: String(value),
  }));

  const category = (product.categories || [])[0] || null;
  const supplier = extractSupplierUrl(rawDescription, product.short_description) || product.url || null;
  const downloadFiles = (downloadsBySlug[slug] || [])
    .map(file => ({
      label: file.label || 'Technický dokument',
      url: file.url || '',
    }))
    .filter(file => file.url);

  return {
    owner_id: OWNER_ID,
    category: category,
    name,
    slug,
    brand,
    price_cents: priceCents(product.price),
    short_description: shortDescription || null,
    description: description || null,
    main_image_url: mainImage,
    gallery_images: galleryImages,
    color_options: colors,
    color_families: colorFamilies,
    dimensions,
    dimension_groups: dimensionGroups,
    variations: variationsJson,
    specifications,
    download_files: downloadFiles,
    supplier_url: supplier,
    source_url: supplier,
  };
}

function renderInsert(row) {
  const cols = [
    'owner_id', 'category_id', 'name', 'slug', 'brand',
    'price_cents', 'short_description', 'description',
    'main_image_url', 'gallery_images', 'color_options', 'color_families',
    'dimensions', 'dimension_groups', 'variations', 'specifications',
    'download_files', 'supplier_url', 'source_url', 'is_active', 'sort_order',
  ];

  const values = [
    `'${row.owner_id}'::uuid`,
    sqlCategoryLookup(row.category),
    sqlText(row.name),
    sqlText(row.slug),
    sqlText(row.brand),
    sqlInt(row.price_cents),
    sqlText(row.short_description),
    sqlText(row.description),
    sqlText(row.main_image_url),
    sqlTextArray(row.gallery_images),
    sqlJsonb(row.color_options),
    sqlTextArray(row.color_families),
    sqlTextArray(row.dimensions),
    sqlTextArray(row.dimension_groups),
    sqlJsonb(row.variations),
    sqlJsonb(row.specifications),
    sqlJsonb(row.download_files),
    sqlText(row.supplier_url),
    sqlText(row.source_url),
    sqlBool(true),
    sqlInt(0),
  ];

  return `INSERT INTO public.kochlik_products (
  ${cols.join(', ')}
) VALUES (
  ${values.join(',\n  ')}
) ON CONFLICT (owner_id, slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price_cents = EXCLUDED.price_cents,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  main_image_url = EXCLUDED.main_image_url,
  gallery_images = EXCLUDED.gallery_images,
  color_options = EXCLUDED.color_options,
  color_families = EXCLUDED.color_families,
  dimensions = EXCLUDED.dimensions,
  dimension_groups = EXCLUDED.dimension_groups,
  variations = EXCLUDED.variations,
  specifications = EXCLUDED.specifications,
  download_files = EXCLUDED.download_files,
  supplier_url = EXCLUDED.supplier_url,
  source_url = EXCLUDED.source_url,
  is_active = EXCLUDED.is_active,
  updated_at = now();`;
}

function main() {
  const catalogPath = path.join(ROOT, 'data', 'master_catalog.json');
  const brandsPath = path.join(ROOT, 'data', 'product_brands.json');
  const downloadsPath = path.join(ROOT, 'data', 'e3p_downloads.json');

  const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
  const downloadsBySlug = fs.existsSync(downloadsPath)
    ? JSON.parse(fs.readFileSync(downloadsPath, 'utf8'))
    : {};

  console.log(`Loaded ${products.length} products and ${Object.keys(brands).length} brand entries`);

  const header = `-- Seed Kochlik products from kochlik-nextjs/data/master_catalog.json
-- Generated ${new Date().toISOString()} — ${products.length} products
-- Run in Supabase SQL Editor for project ngifengeshwvyzhqvprn AFTER create_kochlik_products.sql.
-- Re-runnable: ON CONFLICT (owner_id, slug) DO UPDATE.

BEGIN;
`;

  const seenSlugs = new Set();
  const statements = [];
  let skipped = 0;

  for (const product of products) {
    if (!product.slug) { skipped++; continue; }
    if (seenSlugs.has(product.slug)) {
      console.warn(`  ! duplicate slug, skipping: ${product.slug}`);
      skipped++;
      continue;
    }
    seenSlugs.add(product.slug);

    const row = buildProductRow(product, brands, downloadsBySlug);
    statements.push(renderInsert(row));
  }

  const footer = `\nCOMMIT;\n`;
  const sql = header + '\n' + statements.join('\n\n') + footer;

  const localPath = path.join(ROOT, 'data', 'seed_kochlik_products.sql');
  const cmsPath = path.join(CMS_SQL_DIR, 'seed_kochlik_products.sql');

  fs.writeFileSync(localPath, sql, 'utf8');
  console.log(`✓ wrote ${statements.length} INSERT statements (${(sql.length / 1024).toFixed(1)} KB)`);
  console.log(`  → ${localPath}`);

  if (fs.existsSync(CMS_SQL_DIR)) {
    fs.writeFileSync(cmsPath, sql, 'utf8');
    console.log(`  → ${cmsPath}`);
  } else {
    console.warn(`  ! CMS sql/ dir not found, skipped copy to ${cmsPath}`);
  }

  if (skipped) console.log(`Skipped ${skipped} entries`);
}

main();
