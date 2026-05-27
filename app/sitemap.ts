import type { MetadataRoute } from 'next';
import { categoryLinks, getCatalog } from '@/lib/data';
import { getBlogPosts } from '@/lib/blog';
import { absoluteImageUrl, absoluteUrl } from '@/lib/seo';

const staticPages = [
  { path: '/', priority: 1 },
  { path: '/pre-koho', priority: 0.7 },
  { path: '/o-nas', priority: 0.7 },
  { path: '/referencie', priority: 0.7 },
  { path: '/blog', priority: 0.7 },
  { path: '/faq', priority: 0.5 },
  { path: '/kontakt', priority: 0.8 },
  { path: '/ochrana-osobnych-udajov', priority: 0.2 },
  { path: '/obchodne-podmienky', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const categorySlugs = ['vsetky', ...categoryLinks.map(category => category.slug)];
  const staticEntries = staticPages.map(page => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: page.priority,
  }));

  const categoryEntries = categorySlugs.map(slug => ({
    url: absoluteUrl(`/product-category/${slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: slug === 'vsetky' ? 0.9 : 0.8,
  }));

  const productEntries = getCatalog().map(product => ({
    url: absoluteUrl(`/produkt/${product.slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
    images: product.images.slice(0, 4).map(absoluteImageUrl),
  }));

  const blogEntries = getBlogPosts().map(post => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.55,
    images: post.featuredImage ? [absoluteImageUrl(post.featuredImage)] : undefined,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...blogEntries,
  ];
}
