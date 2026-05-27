import fs from 'fs';
import path from 'path';

interface ScrapedPost {
  id: number;
  slug: string;
  title: string;
  title_html?: string;
  date: string;
  url: string;
  excerpt: string;
  content_html: string;
  content_text: string;
  image_urls: string[];
  local_images: string[];
  featured_image: string | null;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  url: string;
  excerpt: string;
  contentHtml: string;
  contentText: string;
  featuredImage: string | null;
}

function toPublicImagePath(localPath: string | null | undefined): string | null {
  if (!localPath) return null;
  if (localPath.startsWith('/')) return localPath;
  return `/${localPath.replace(/^scraped_blog\/images\//, 'images/blog/')}`;
}

function formatSlovakDate(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('sk-SK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function normalizePost(post: ScrapedPost): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    dateLabel: formatSlovakDate(post.date),
    url: post.url,
    excerpt: post.excerpt,
    contentHtml: post.content_html,
    contentText: post.content_text,
    featuredImage: toPublicImagePath(post.featured_image),
  };
}

let cache: BlogPost[] | null = null;

export function getBlogPosts(): BlogPost[] {
  if (cache) return cache;
  try {
    const filePath = path.join(process.cwd(), 'data', 'master_blog.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const posts = JSON.parse(raw) as ScrapedPost[];
    cache = posts
      .map(normalizePost)
      .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
    return cache;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    cache = [];
    return cache;
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find(post => post.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getBlogPosts()
    .filter(other => other.slug !== post.slug)
    .slice(0, limit);
}
