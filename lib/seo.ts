import type { Metadata } from 'next';
import type { BlogPost } from '@/lib/blog';
import type { Product } from '@/lib/data';

const fallbackSiteUrl = 'https://kochlik.sk';

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const siteConfig = {
  name: 'KOCHLIK',
  legalName: 'KOCHLIK s.r.o.',
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl),
  defaultTitle: 'Dizajnové kvetináče Bratislava',
  defaultDescription:
    'KOCHLIK je bratislavská predajňa kvalitných talianskych dizajnových kvetináčov, exteriérového nábytku a doplnkov pre interiér, terasu aj záhradu.',
  locale: 'sk_SK',
  language: 'sk',
  phone: '+421 905 587 986',
  phoneHref: '+421905587986',
  email: 'info@kochlik.eu',
  defaultImage: '/legacy/kochlik-predajna.jpg',
  address: {
    streetAddress: 'Ulica 29. augusta 28',
    postalCode: '811 09',
    addressLocality: 'Bratislava',
    addressCountry: 'SK',
  },
  geo: {
    latitude: 48.146287,
    longitude: 17.119921,
  },
  sameAs: ['https://www.facebook.com/kochlikba'],
};

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalizedPath}`;
}

export function absoluteImageUrl(path?: string | null): string {
  if (!path) {
    return absoluteUrl(siteConfig.defaultImage);
  }

  return absoluteUrl(path);
}

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateDescription(value: string, fallback = siteConfig.defaultDescription): string {
  const text = stripHtml(value || fallback);
  if (text.length <= 158) {
    return text;
  }

  return `${text.slice(0, 155).trimEnd()}...`;
}

export function createMetadata({
  title,
  description,
  path = '/',
  image = siteConfig.defaultImage,
  type = 'website',
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteImageUrl(image);
  const cleanDescription = truncateDescription(description);

  return {
    title,
    description: cleanDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: cleanDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cleanDescription,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
          },
        },
  };
}

export function getPriceNumbers(price: string): number[] {
  const matches = price.match(/\d[\d\s,.]*/g) || [];

  return matches
    .map(value => {
      const compact = value.replace(/\s/g, '');
      const normalized =
        compact.includes(',') && compact.includes('.')
          ? compact.replace(/,/g, '')
          : compact.replace(',', '.');
      return Number(normalized);
    })
    .filter(value => Number.isFinite(value));
}

function productOfferJsonLd(product: Product) {
  const prices = product.variations.length > 0
    ? product.variations.flatMap(variation => getPriceNumbers(variation.price))
    : getPriceNumbers(product.price);

  if (prices.length === 0) {
    return undefined;
  }

  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);
  const offerBase = {
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl(`/produkt/${product.slug}`),
    seller: {
      '@type': 'Organization',
      name: siteConfig.legalName,
    },
  };

  if (prices.length > 1 || lowPrice !== highPrice) {
    return {
      '@type': 'AggregateOffer',
      ...offerBase,
      lowPrice,
      highPrice,
      offerCount: Math.max(prices.length, product.variations.length || 1),
    };
  }

  return {
    '@type': 'Offer',
    ...offerBase,
    price: lowPrice,
  };
}

export function createProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': absoluteUrl(`/produkt/${product.slug}#product`),
    name: product.name,
    description: truncateDescription(product.description || product.shortDescription),
    image: product.images.length > 0 ? product.images.map(absoluteImageUrl) : [absoluteImageUrl()],
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.categories.join(', '),
    color: product.colors.map(color => color.name).join(', ') || undefined,
    size: product.dimensions.join(', ') || undefined,
    offers: productOfferJsonLd(product),
  };
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createProductItemListJsonLd(products: Product[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#products`,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/produkt/${product.slug}`),
      name: product.name,
      image: absoluteImageUrl(product.images[0]),
    })),
  };
}

export function createBlogPostingJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': absoluteUrl(`/blog/${post.slug}#article`),
    headline: post.title,
    description: truncateDescription(post.excerpt || post.contentText),
    image: absoluteImageUrl(post.featuredImage),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: siteConfig.language,
    author: {
      '@type': 'Organization',
      name: siteConfig.legalName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/legacy/logo.svg'),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function createSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.siteUrl}#website`,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        inLanguage: siteConfig.language,
        publisher: {
          '@id': `${siteConfig.siteUrl}#localbusiness`,
        },
      },
      {
        '@type': ['LocalBusiness', 'Store'],
        '@id': `${siteConfig.siteUrl}#localbusiness`,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        url: siteConfig.siteUrl,
        image: absoluteImageUrl(siteConfig.defaultImage),
        logo: absoluteUrl('/legacy/logo.svg'),
        telephone: siteConfig.phone,
        email: siteConfig.email,
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          ...siteConfig.address,
        },
        geo: {
          '@type': 'GeoCoordinates',
          ...siteConfig.geo,
        },
        areaServed: [
          {
            '@type': 'City',
            name: 'Bratislava',
          },
          {
            '@type': 'Country',
            name: 'Slovensko',
          },
        ],
        sameAs: siteConfig.sameAs,
      },
    ],
  };
}

export function createFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
