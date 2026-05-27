#!/usr/bin/env node
/**
 * Upload scraped Euro3plast PDFs to Supabase Storage and write a CMS import SQL.
 *
 * This uses the same bucket style as future CMS uploads:
 *   site-uploads/kochlik/products/{productId}/downloads/*.pdf
 *
 * Auth:
 *   - SUPABASE_STORAGE_AUTH_TOKEN can be a service role key or user access token.
 *   - If missing, the script falls back to the CMS anon key from ../cms/aeb_cms/.env.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CMS_ROOT = path.resolve(ROOT, '..', '..', 'cms', 'aeb_cms');
const CMS_SQL_DIR = path.join(CMS_ROOT, 'sql');
const CMS_ENV_PATH = path.join(CMS_ROOT, '.env');
const DOWNLOADS_PATH = path.join(ROOT, 'data', 'e3p_downloads.json');
const LOCAL_CACHE_DIR = path.join(ROOT, 'public', 'downloads', 'e3p');
const OUTPUT_MAP_PATH = path.join(ROOT, 'data', 'e3p_downloads_supabase.json');
const OUTPUT_SQL_PATH = path.join(ROOT, 'data', 'import_e3p_download_files.sql');
const CMS_OUTPUT_SQL_PATH = path.join(CMS_SQL_DIR, 'import_e3p_download_files.sql');

const OWNER_ID = 'c28707c3-2289-48b9-bbd3-08a441fd02fc';
const BUCKET = 'site-uploads';

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].replace(/^"|"$/g, '');
  }
  return env;
}

const cmsEnv = readEnvFile(CMS_ENV_PATH);
const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || cmsEnv.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || cmsEnv.VITE_SUPABASE_ANON_KEY || '';
const authToken = process.env.SUPABASE_STORAGE_AUTH_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY || anonKey;

if (!supabaseUrl || !anonKey || !authToken) {
  throw new Error('Missing Supabase config. Set SUPABASE_URL and SUPABASE_STORAGE_AUTH_TOKEN or keep CMS .env available.');
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sqlText(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJsonb(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

function fileNameFor(slug, file, index) {
  const urlPath = new URL(file.url).pathname;
  const sourceName = decodeURIComponent(path.basename(urlPath)).replace(/\.pdf$/i, '');
  const base = slugify(sourceName || file.label || `document-${index + 1}`);
  return `${slug}-${index + 1}-${base}.pdf`;
}

function cachedFilePath(slug, file, index) {
  return path.join(LOCAL_CACHE_DIR, fileNameFor(slug, file, index));
}

async function getPdfBuffer(slug, file, index) {
  const cachePath = cachedFilePath(slug, file, index);
  if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 1000) {
    return fs.readFileSync(cachePath);
  }

  const response = await fetch(file.url, {
    headers: {
      'user-agent': 'Mozilla/5.0 Kochlik Supabase PDF import',
      accept: 'application/pdf,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while downloading ${file.url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1000 || buffer.subarray(0, 4).toString() !== '%PDF') {
    throw new Error(`Downloaded file is not a valid PDF: ${file.url}`);
  }
  return buffer;
}

function storagePublicUrl(storagePath) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

async function fetchProductIds(slugs) {
  const products = new Map();
  const url = new URL(`${supabaseUrl}/rest/v1/kochlik_products`);
  url.searchParams.set('select', 'id,slug');
  url.searchParams.set('owner_id', `eq.${OWNER_ID}`);

  const response = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Could not read products: ${response.status} ${await response.text()}`);
  }

  const rows = await response.json();
  const slugSet = new Set(slugs);
  for (const row of rows) {
    if (slugSet.has(row.slug)) products.set(row.slug, row.id);
  }
  return products;
}

async function uploadPdf(storagePath, buffer) {
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${encodedPath}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/pdf',
      'Cache-Control': '3600',
      'x-upsert': 'true',
    },
    body: buffer,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Upload failed for ${storagePath}: ${response.status} ${detail}`);
  }
}

function buildImportSql(downloadsBySlug) {
  const statements = Object.entries(downloadsBySlug)
    .filter(([, files]) => Array.isArray(files) && files.length > 0)
    .sort(([a], [b]) => a.localeCompare(b, 'sk'))
    .map(([slug, files]) => `update public.kochlik_products
set download_files = ${sqlJsonb(files.map(file => ({ label: file.label, url: file.url })))},
    updated_at = now()
where owner_id = '${OWNER_ID}'::uuid
  and slug = ${sqlText(slug)}
  and jsonb_array_length(download_files) = 0;`);

  return `-- Import Euro3plast PDF download files into Kochlik CMS.
-- Files are hosted in Supabase Storage bucket "${BUCKET}".
-- Only fills products whose download_files array is currently empty.

BEGIN;

${statements.join('\n\n')}

COMMIT;
`;
}

async function main() {
  const downloadsBySlug = JSON.parse(fs.readFileSync(DOWNLOADS_PATH, 'utf8'));
  const productIds = await fetchProductIds(Object.keys(downloadsBySlug));
  const missingProducts = Object.keys(downloadsBySlug).filter(slug => !productIds.has(slug));
  if (missingProducts.length > 0) {
    console.warn(`Missing ${missingProducts.length} products in CMS, skipping: ${missingProducts.join(', ')}`);
  }

  const supabaseMap = {};
  let uploaded = 0;

  for (const [slug, files] of Object.entries(downloadsBySlug)) {
    const productId = productIds.get(slug);
    if (!productId) continue;

    supabaseMap[slug] = [];
    for (const [index, file] of files.entries()) {
      const fileName = fileNameFor(slug, file, index);
      const storagePath = `kochlik/products/${productId}/downloads/${fileName}`;
      const buffer = await getPdfBuffer(slug, file, index);
      await uploadPdf(storagePath, buffer);
      uploaded += 1;

      supabaseMap[slug].push({
        label: file.label || 'Technický dokument',
        url: storagePublicUrl(storagePath),
        storage_path: storagePath,
        original_url: file.url,
      });
    }
  }

  fs.writeFileSync(OUTPUT_MAP_PATH, `${JSON.stringify(supabaseMap, null, 2)}\n`, 'utf8');
  const sql = buildImportSql(supabaseMap);
  fs.writeFileSync(OUTPUT_SQL_PATH, sql, 'utf8');
  if (fs.existsSync(CMS_SQL_DIR)) {
    fs.writeFileSync(CMS_OUTPUT_SQL_PATH, sql, 'utf8');
  }

  console.log(`Uploaded ${uploaded} PDFs to Supabase Storage`);
  console.log(`Wrote ${OUTPUT_MAP_PATH}`);
  console.log(`Wrote ${OUTPUT_SQL_PATH}`);
  if (fs.existsSync(CMS_SQL_DIR)) console.log(`Copied ${CMS_OUTPUT_SQL_PATH}`);
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
