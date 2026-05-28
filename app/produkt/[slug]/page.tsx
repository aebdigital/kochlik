import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import ProductInfoPanel from '@/components/ProductInfoPanel';
import { getCatalog, getCategorySlugByName, getProductBySlug, getRelatedProducts } from '@/lib/data';
import { createBreadcrumbJsonLd, createMetadata, createProductJsonLd, truncateDescription } from '@/lib/seo';

function renderDescription(text: string) {
  if (!text) return null;
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [, linkText, linkUrl] = match;
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

export async function generateStaticParams() {
  return (await getCatalog()).map(product => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryLabel = product.categories[0] || 'Dizajnové produkty';

  return createMetadata({
    title: `${product.name} v Bratislave`,
    description: truncateDescription(
      `${product.name} od KOCHLIK Bratislava. ${product.description || product.shortDescription || categoryLabel}`
    ),
    path: `/produkt/${product.slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const galleryImages = product.images.length > 0 ? product.images : ['/legacy/pot1.jpg'];
  const relatedProducts = await getRelatedProducts(product, 4);
  const primaryCategorySlug = product.categories[0] ? getCategorySlugByName(product.categories[0]) : 'vsetky';
  const downloadFiles = product.downloadFiles || [];
  const productJsonLd = createProductJsonLd(product);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: 'Domov', path: '/' },
    ...(product.categories[0]
      ? [{ name: product.categories[0], path: `/produkt-kategoria/${primaryCategorySlug}` }]
      : []),
    { name: product.name, path: `/produkt/${product.slug}` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <main className="flex-1 bg-white">
        <section className="bg-[#efefef] pb-20 pt-12">
          <div className="site-container">
            <nav className="mb-8 text-[15px] font-light text-[#999]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[var(--color-brand)]">Domov</Link>
              <span className="mx-2">/</span>
              {product.categories[0] && (
                <>
                  <Link href={`/produkt-kategoria/${primaryCategorySlug}`} className="hover:text-[var(--color-brand)]">
                    {product.categories[0]}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
              <span>{product.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <ProductGallery images={galleryImages} alt={product.name} />

              <div className="pt-1">
                <h1 className="mb-6 text-[40px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[48px]">
                  {product.name}
                </h1>

                {product.description && (
                  <div className="mb-8 max-w-[780px] whitespace-pre-line text-[18px] font-light leading-[1.5]">
                    {renderDescription(product.description)}
                  </div>
                )}

                <ProductInfoPanel product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* Product Description & Downloads Section */}
        {(product.shortDescription || downloadFiles.length > 0) && (
          <section className="border-t border-[#e5e5e5] bg-white py-20">
            <div className="site-container">
              <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
                {product.shortDescription && (
                  <div>
                    <h2 className="mb-8 text-[22px] font-extrabold uppercase tracking-wider text-[var(--color-brown)]">
                      Popis produktu
                    </h2>
                    <div className="whitespace-pre-line text-[18px] font-light leading-[1.5]">
                      {renderDescription(product.shortDescription)}
                    </div>
                  </div>
                )}

                {downloadFiles.length > 0 && (
                  <div>
                    <h2 className="mb-8 text-[22px] font-extrabold uppercase tracking-wider text-[var(--color-brown)]">
                      Dokumenty na stiahnutie
                    </h2>
                    <div className="grid gap-4">
                      {downloadFiles.map(file => (
                        <a
                          key={file.url}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-16 items-center justify-between border border-[#d9d9d9] bg-white px-5 py-4 text-[15px] font-semibold text-[#444] transition-all hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center bg-red-50 text-red-600 font-extrabold text-[12px]">
                              PDF
                            </span>
                            <span className="font-light text-[#555]">{file.label || 'Technický dokument'}</span>
                          </div>
                          <span className="text-[13px] font-extrabold uppercase tracking-wide text-gray-400 hover:text-[var(--color-brand)]">
                            Stiahnuť
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
