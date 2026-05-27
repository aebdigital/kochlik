#!/usr/bin/env node
/**
 * Generate a focused SQL import for Euro3plast download files.
 *
 * This only updates public.kochlik_products.download_files for matching slugs
 * where the CMS value is still empty. It does not touch descriptions, prices,
 * images, categories, colors, or any other product fields.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CMS_SQL_DIR = path.resolve(ROOT, '..', '..', 'cms', 'aeb_cms', 'sql');
const OWNER_ID = 'c28707c3-2289-48b9-bbd3-08a441fd02fc';

function sqlText(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJsonb(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

function main() {
  const supabaseDownloadsPath = path.join(ROOT, 'data', 'e3p_downloads_supabase.json');
  const remoteDownloadsPath = path.join(ROOT, 'data', 'e3p_downloads.json');
  const downloadsPath = fs.existsSync(supabaseDownloadsPath) ? supabaseDownloadsPath : remoteDownloadsPath;
  const downloadsBySlug = JSON.parse(fs.readFileSync(downloadsPath, 'utf8'));

  const statements = Object.entries(downloadsBySlug)
    .filter(([, files]) => Array.isArray(files) && files.length > 0)
    .sort(([a], [b]) => a.localeCompare(b, 'sk'))
    .map(([slug, files]) => {
      const normalizedFiles = files
        .map(file => ({
          label: file.label || 'Technický dokument',
          url: file.url || '',
        }))
        .filter(file => file.url);

      return `update public.kochlik_products
set download_files = ${sqlJsonb(normalizedFiles)},
    updated_at = now()
where owner_id = '${OWNER_ID}'::uuid
  and slug = ${sqlText(slug)}
  and jsonb_array_length(download_files) = 0;`;
    });

  const sql = `-- Import Euro3plast PDF download files into Kochlik CMS.
-- Safe to run after add_kochlik_download_files.sql.
-- Only fills products whose download_files array is currently empty.
-- Source: ${path.relative(ROOT, downloadsPath)}

BEGIN;

${statements.join('\n\n')}

COMMIT;
`;

  const localPath = path.join(ROOT, 'data', 'import_e3p_download_files.sql');
  fs.writeFileSync(localPath, sql, 'utf8');
  console.log(`Wrote ${statements.length} update statements to ${localPath}`);

  if (fs.existsSync(CMS_SQL_DIR)) {
    const cmsPath = path.join(CMS_SQL_DIR, 'import_e3p_download_files.sql');
    fs.writeFileSync(cmsPath, sql, 'utf8');
    console.log(`Copied to ${cmsPath}`);
  }
}

main();
