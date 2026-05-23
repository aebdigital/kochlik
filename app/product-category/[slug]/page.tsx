import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import ProductListing from '@/components/ProductListing';
import {
  categoryLinks,
  getCategoryDescription,
  getProductsByCategory,
  resolveCategoryName,
} from '@/lib/data';

const extraCategorySlugs = ['vsetky', 'moderne', 'klasicke', 'svietiace'];

export function generateStaticParams() {
  return [
    ...extraCategorySlugs.map(slug => ({ slug })),
    ...categoryLinks.map(category => ({ slug: category.slug })),
  ];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = getProductsByCategory(slug);
  const title = resolveCategoryName(slug);
  const description = getCategoryDescription(slug);

  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container pb-12 pt-24 text-center">
          <h1 className="mb-6 text-[34px] font-extrabold leading-tight text-[#333] md:text-[42px]">
            {title}
          </h1>
          <p className="mx-auto max-w-[1420px] text-[20px] font-light leading-relaxed text-[#999] md:text-[24px]">
            {description}
          </p>
        </section>

        <section className="site-container pb-28">
          <ProductListing products={products} />
        </section>
      </main>

      <Footer />
    </>
  );
}
