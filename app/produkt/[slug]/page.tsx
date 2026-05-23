import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import { getCatalog, getCategorySlugByName, getProductBySlug, getRelatedProducts } from '@/lib/data';

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
  const [mainImage] = galleryImages;
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
              <div>
                <div className="relative h-[560px] max-w-[680px] overflow-hidden bg-white lg:h-[830px]">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <button aria-label="Otvoriť obrázok" className="absolute right-4 top-4 text-[#999]">
                    <span className="relative block h-5 w-5 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-[#999] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-[#999]" />
                  </button>
                </div>

                {galleryImages.length > 1 && (
                  <div className="mt-4 flex max-w-[680px] gap-3 overflow-x-auto no-scrollbar">
                    {galleryImages.slice(0, 5).map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        aria-label={`Obrázok produktu ${index + 1}`}
                        className="relative h-28 w-28 shrink-0 overflow-hidden bg-white opacity-75 transition-opacity hover:opacity-100"
                      >
                        <Image src={image} alt="" fill sizes="112px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-1">
                <h1 className="mb-9 text-[40px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[48px]">
                  {product.name}
                </h1>

                <div className="max-w-[780px] border border-[#d9d9d9] bg-[#efefef]">
                  <div className="flex h-14 items-center justify-center gap-8 text-[#333]">
                    <button aria-label="Znížiť množstvo">
                      <ChevronLeft className="h-4 w-4 fill-current" />
                    </button>
                    <span className="text-[16px] font-light">1</span>
                    <button aria-label="Zvýšiť množstvo">
                      <ChevronRight className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <button className="h-16 w-full bg-[var(--color-brand)] text-[22px] font-light text-white transition-colors hover:bg-[var(--color-brand-dark)]">
                    Pridať do košíka
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-5 text-[#aaa]">
                  <button aria-label="Pridať medzi obľúbené" className="hover:text-[var(--color-brand)]">
                    <Heart className="h-6 w-6 fill-current" />
                  </button>
                  <span className="h-7 w-px bg-[#d6d6d6]" />
                  <a href="https://www.facebook.com/kochlikba" aria-label="Facebook" className="hover:text-[var(--color-brand)]">
                    <span className="text-[24px] font-extrabold leading-none">f</span>
                  </a>
                  <a href="https://www.linkedin.com/in/anita-kochlik-924b4b6a/" aria-label="LinkedIn" className="hover:text-[var(--color-brand)]">
                    <span className="text-[20px] font-extrabold leading-none">in</span>
                  </a>
                </div>

                {product.categories.length > 0 && (
                  <div className="mt-14 flex flex-wrap gap-3 text-[15px] font-light text-[#777]">
                    {product.categories.map(category => (
                      <span key={category} className="border border-[#d4d4d4] px-4 py-2">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="site-container py-20">
          <div className="max-w-[1320px] text-[22px] font-light leading-[1.9] text-[#777] whitespace-pre-line">
            {product.description ||
              'Elegantný produkt s výrazným tvarom, ktorý vynikne v interiéri aj exteriéri. Pre viac informácií nás kontaktujte telefonicky alebo e-mailom.'}
          </div>
          {!hasSupplierLine && (
            <p className="mt-16 text-[20px] font-light text-[#777]">
              Pre viac informácií navštívte stránku dodávateľa{' '}
              <a href={product.url} className="text-[var(--color-brand)] hover:text-[var(--color-brand-dark)]">
                tu
              </a>
            </p>
          )}
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
