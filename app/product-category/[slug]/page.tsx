import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import ProductListing from '@/components/ProductListing';
import {
  categoryLinks,
  getCanonicalCategorySlug,
  getCategoryDescription,
  getProductsByCategory,
  resolveCategoryName,
} from '@/lib/data';
import { createBreadcrumbJsonLd, createMetadata, createProductItemListJsonLd } from '@/lib/seo';

const extraCategorySlugs = ['vsetky', 'moderne', 'klasicke', 'svietiace'];

export function generateStaticParams() {
  return [
    ...extraCategorySlugs.map(slug => ({ slug })),
    ...categoryLinks.map(category => ({ slug: category.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = resolveCategoryName(slug);
  const description = getCategoryDescription(slug);
  const canonicalSlug = getCanonicalCategorySlug(slug);

  return createMetadata({
    title: `${title} v Bratislave`,
    description,
    path: `/produkt-kategoria/${canonicalSlug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  const title = resolveCategoryName(slug);
  const description = getCategoryDescription(slug);
  const canonicalSlug = getCanonicalCategorySlug(slug);
  const categoryPath = `/produkt-kategoria/${canonicalSlug}`;
  const categoryJsonLd = createProductItemListJsonLd(products, categoryPath);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: 'Domov', path: '/' },
    { name: title, path: categoryPath },
  ]);

  return (
    <>
      <Header />
      <CategoryBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />

      <main className="flex-1 bg-white">
        <section className="site-container pb-28 pt-16">
          <ProductListing products={products} heading={title} description={description} />
        </section>
      </main>

      <Footer />
    </>
  );
}
