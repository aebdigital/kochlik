#!/usr/bin/env node
/**
 * Scrape Euro3plast product attachment PDFs referenced by master_catalog.json.
 *
 * Output:
 *   kochlik-nextjs/data/e3p_downloads.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data', 'master_catalog.json');
const OUTPUT_PATH = path.join(ROOT, 'data', 'e3p_downloads.json');

const USER_AGENT = 'Mozilla/5.0 (compatible; KochlikCMS/1.0; +https://kochlik.sk)';

function extractMarkdownUrl(text = '') {
  const match = String(text).match(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/i);
  return match?.[1] || null;
}

function supplierUrlFor(product) {
  const raw = extractMarkdownUrl(product.long_description) || extractMarkdownUrl(product.short_description);
  if (!raw || !/euro3plast\.com/i.test(raw)) return null;
  return raw.replace(/#.*$/, '');
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function labelFor(text, url) {
  const normalized = decodeHtml(text).toLowerCase();
  if (normalized.includes('information')) return 'Informačný dokument';
  if (normalized.includes('info')) return 'Informačný dokument';
  if (normalized.includes('technical')) return 'Technický dokument';

  const fileName = decodeURIComponent(url.split('/').pop() || '').replace(/[_-]+/g, ' ');
  if (/info/i.test(fileName)) return 'Informačný dokument';
  return 'Technický dokument';
}

function parseDownloads(html, pageUrl) {
  const sectionMatch = html.match(/<section[^>]*class="[^"]*product-attachments[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
  const source = sectionMatch?.[1] || '';
  const downloads = [];
  const seen = new Set();
  const linkPattern = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(source)) !== null) {
    const href = decodeHtml(match[1]);
    if (!href || !/\.pdf(?:$|\?)/i.test(href)) continue;

    const url = new URL(href, pageUrl).toString();
    if (seen.has(url)) continue;
    seen.add(url);
    downloads.push({
      label: labelFor(match[2], url),
      url,
    });
  }

  return downloads;
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function main() {
  const products = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const e3pProducts = products
    .map(product => ({ product, url: supplierUrlFor(product) }))
    .filter(item => item.url);

  const downloadsBySlug = {};
  let found = 0;
  let failed = 0;

  console.log(`Checking ${e3pProducts.length} Euro3plast products`);

  for (const { product, url } of e3pProducts) {
    try {
      const html = await fetchPage(url);
      const downloads = parseDownloads(html, url);

      if (downloads.length > 0) {
        downloadsBySlug[product.slug] = downloads;
        found += downloads.length;
        console.log(`✓ ${product.slug}: ${downloads.length}`);
      } else {
        console.log(`- ${product.slug}: no product PDFs`);
      }
    } catch (error) {
      failed++;
      console.warn(`! ${product.slug}: ${error.message}`);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(downloadsBySlug, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${found} download links for ${Object.keys(downloadsBySlug).length} products`);
  if (failed) console.log(`Failed pages: ${failed}`);
}

main();
