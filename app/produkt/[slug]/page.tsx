import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import ProductInfoPanel from '@/components/ProductInfoPanel';
import { getCatalog, getCategorySlugByName, getProductBySlug, getRelatedProducts } from '@/lib/data';

function renderDescription(text: string) {
  if (!text) return null;
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [_, linkText, linkUrl] = match;
    const matchIndex = match.index;

    // Add preceding text
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Add link
    parts.push(
      <a
        key={matchIndex}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-brand)] hover:underline font-normal"
      >
        {linkText}
      </a>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function generateStaticParams() {
  return getCatalog().map(product => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const galleryImages = product.images.length > 0 ? product.images : ['/legacy/pot1.jpg'];
  const relatedProducts = getRelatedProducts(product, 4);
  const primaryCategorySlug = product.categories[0] ? getCategorySlugByName(product.categories[0]) : 'vsetky';
  const hasSupplierLine = product.description.toLowerCase().includes('pre viac inform');

  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="bg-[#efefef] pb-20 pt-12">
          <div className="site-container">
            <nav className="mb-8 text-[15px] font-light text-[#999]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[var(--color-brand)]">Domov</Link>
              <span className="mx-2">/</span>
              {product.categories[0] && (
                <>
                  <Link href={`/product-category/${primaryCategorySlug}`} className="hover:text-[var(--color-brand)]">
                    {product.categories[0]}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
              <span>{product.name}</span>
            </nav>

            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
              <ProductGallery images={galleryImages} alt={product.name} />

              <div className="pt-1">
                <h1 className="mb-6 text-[40px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[48px]">
                  {product.name}
                </h1>

                {product.description && (
                  <div className="mb-8 max-w-[780px] whitespace-pre-line text-[17px] font-light leading-[1.75] text-[#666]">
                    {renderDescription(product.description)}
                  </div>
                )}

                {!hasSupplierLine && (
                  <p className="mb-10 text-[15px] font-light text-[#777]">
                    Pre viac informácií navštívte stránku dodávateľa{' '}
                    <a href={product.url} className="text-[var(--color-brand)] hover:text-[var(--color-brand-dark)]">
                      tu
                    </a>
                  </p>
                )}

                <ProductInfoPanel product={product} />
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="site-container border-t border-[#e5e5e5] py-20">
            <h2 className="mb-10 text-[30px] font-extrabold leading-tight text-[var(--color-brown)]">
              Súvisiace produkty
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
