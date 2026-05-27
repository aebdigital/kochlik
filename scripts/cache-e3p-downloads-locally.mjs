#!/usr/bin/env node
/**
 * Keep a local frontend cache of E3P PDFs under public/downloads/e3p.
 *
 * This cache is not used by the CMS import SQL. The CMS import should point to
 * Supabase Storage URLs from data/e3p_downloads_supabase.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INPUT_PATH = path.join(ROOT, 'data', 'e3p_downloads.json');
const OUTPUT_DIR = path.join(ROOT, 'public', 'downloads', 'e3p');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fileNameFor(slug, file, index) {
  const urlPath = new URL(file.url).pathname;
  const sourceName = decodeURIComponent(path.basename(urlPath)).replace(/\.pdf$/i, '');
  const base = slugify(sourceName || file.label || `document-${index + 1}`);
  return `${slug}-${index + 1}-${base}.pdf`;
}

async function downloadPdf(url, outputPath) {
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
    return 'cached';
  }

  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 Kochlik local PDF cache',
      accept: 'application/pdf,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1000 || buffer.subarray(0, 4).toString() !== '%PDF') {
    throw new Error(`Downloaded file is not a valid PDF: ${url}`);
  }

  fs.writeFileSync(outputPath, buffer);
  return 'downloaded';
}

async function main() {
  const downloadsBySlug = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let downloaded = 0;
  let cached = 0;

  for (const [slug, files] of Object.entries(downloadsBySlug)) {
    for (const [index, file] of files.entries()) {
      const outputPath = path.join(OUTPUT_DIR, fileNameFor(slug, file, index));
      const status = await downloadPdf(file.url, outputPath);
      if (status === 'downloaded') downloaded += 1;
      if (status === 'cached') cached += 1;
    }
  }

  console.log(`Cached ${downloaded} PDFs locally (${cached} already existed)`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
