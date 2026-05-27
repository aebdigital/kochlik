import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import HomeHero from '@/components/HomeHero';
import { getProductsByCategory } from '@/lib/data';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Dizajnové kvetináče Bratislava',
  description:
    'KOCHLIK v Bratislave ponúka dizajnové, moderné, klasické a svietiace talianske kvetináče, doplnky a exteriérový nábytok pre domy, firmy aj architektov.',
  path: '/',
});

const benefits = [
  {
    icon: '/legacy/v1.png',
    title: 'Nízka hmotnosť',
    text: 'S kvetináčmi sa jednoducho manipuluje v interiéri aj exteriéri.',
  },
  {
    icon: '/legacy/v2.png',
    title: 'Odolný materiál',
    text: 'Polyetylén zvládne bežné počasie, slnko aj sezónne používanie.',
  },
  {
    icon: '/legacy/v3.png',
    title: 'Taliansky dizajn',
    text: 'Výrazné tvary od známych dizajnérov pre reprezentatívne priestory.',
  },
  {
    icon: '/legacy/v4.png',
    title: 'Interiér aj exteriér',
    text: 'Produkty sú vhodné do domácností, záhrad, hotelov aj firiem.',
  },
];

export default function HomePage() {
  const featuredProducts = getProductsByCategory('dizajnove').slice(0, 4);

  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <HomeHero />

        <section className="bg-[#f1eeee] py-20">
          <div className="site-container text-center">
            <h2 className="mb-4 text-[34px] font-extrabold uppercase leading-tight text-[var(--color-brown)] md:text-[42px]">
              Výhody kvetináčov
            </h2>
            <p className="mx-auto max-w-[660px] text-[24px] font-light leading-relaxed text-[#666]">
              Za nezvyčajnými vlastnosťami kvetináčov sa ukrýva PE živica, z ktorej sú vyrobené.
            </p>

            <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="mx-auto max-w-[280px] text-center">
                  <Image src={benefit.icon} alt="" width={64} height={64} className="mx-auto mb-6 h-16 w-16 object-contain" />
                  <h3 className="mb-3 text-[20px] font-extrabold uppercase text-[var(--color-brown)]">
                    {benefit.title}
                  </h3>
                  <p className="text-[16px] font-light leading-relaxed text-[#666]">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="site-container grid gap-16 py-24 lg:grid-cols-[0.92fr_1fr] lg:items-center">
          <div className="relative min-h-[420px] w-full">
            <Image
              src="/legacy/k1.jpg"
              alt="Biele dizajnové kvetináče v interiéri"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-[760px]">
            <h2 className="mb-6 text-[36px] font-extrabold uppercase leading-tight text-[var(--color-brown)] md:text-[44px]">
              Pre koho sú určené?
            </h2>
            <p className="mb-12 text-[24px] font-light leading-relaxed text-[#666]">
              Vďaka kombinácii tvarov a jedinečných interpretácií sú kvetináče a doplnky určené hlavne pre architektov a developerov, ale samozrejme dokáže si vybrať každý.
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-[24px] font-extrabold uppercase text-[var(--color-brown)]">
                  Architekti a developeri
                </h3>
                <p className="text-[20px] font-light leading-relaxed text-[#666]">
                  Široký sortiment štýlových a dizajnových kvetináčov aj od známych dizajnérov.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-[24px] font-extrabold uppercase text-[var(--color-brown)]">
                  Koncoví zákazníci
                </h3>
                <p className="text-[20px] font-light leading-relaxed text-[#666]">
                  Každý, kto má balkón, terasu, záhradu, byt či dom, si u nás nájde kvetináče či iné produkty.
                </p>
              </div>
            </div>
            <Link
              href="/pre-koho"
              className="mt-12 inline-flex h-14 items-center bg-[var(--color-brand)] px-10 text-[16px] font-light uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-brand-dark)]"
            >
              Zistiť viac
            </Link>
          </div>
        </section>

        <section className="site-container grid gap-16 py-20 lg:grid-cols-[1fr_0.98fr] lg:items-center">
          <div className="max-w-[760px]">
            <h2 className="mb-6 text-[40px] font-extrabold uppercase leading-tight text-[var(--color-brown)]">
              O nás
            </h2>
            <p className="mb-12 text-[25px] font-light leading-relaxed text-[#666]">
              Sme predajňa kvalitných, ľahkých a odolných kvetináčov od talianskych dizajnérov určených do exteriéru aj interiéru. Okrem dizajnových kvetináčov ponúkame aj kvalitný taliansky nábytok a rôzne produkty pre obchodné centrá, hotely, kúpaliská a wellness zariadenia.
            </p>
            <h3 className="mb-4 text-[24px] font-extrabold uppercase text-[var(--color-brown)]">
              Kamenná predajňa
            </h3>
            <p className="mb-10 text-[20px] font-light leading-relaxed text-[#666]">
              Navštívte našu dizajnovú predajňu v centre Bratislavy, kde si môžete pozrieť vystavené vzorky a katalógy.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex h-14 items-center bg-[var(--color-brand)] px-10 text-[16px] font-light uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-brand-dark)]"
            >
              Kontakt
            </Link>
          </div>
          <div className="relative min-h-[420px] w-full">
            <Image
              src="/legacy/kochlik-predajna.jpg"
              alt="Predajňa KOCHLIK v Bratislave"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="site-container py-20">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-[34px] font-extrabold uppercase leading-tight text-[var(--color-brown)]">
                  Dizajnové produkty
                </h2>
                <p className="mt-3 text-[20px] font-light text-[#666]">Výber z aktuálneho katalógu.</p>
              </div>
              <Link href="/product-category/dizajnove" className="hidden text-[16px] font-extrabold uppercase text-[var(--color-brand)] md:block">
                Zobraziť všetko
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
