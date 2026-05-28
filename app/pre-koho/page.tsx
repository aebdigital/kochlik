import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Kvetináče pre architektov a zákazníkov v Bratislave',
  description:
    'KOCHLIK pomáha architektom, developerom aj koncovým zákazníkom vybrať dizajnové kvetináče, farby a rozmery pre interiér, terasu a exteriér.',
  path: '/pre-koho',
  image: '/legacy/onas-1420x410-1.jpg',
});

export default function PreKohoPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="mx-auto w-full max-w-[85vw] px-4 py-20 sm:px-6 lg:max-w-[1150px]">
          <h1 className="mx-auto mb-14 max-w-[1220px] text-[36px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[44px]">
            Vďaka kombinácia tvarov a jedinečných interpretácií, sú fabriky schopné transformovať čisto funkčný objekt na ohromujúci kus nábytku.
          </h1>
          <div className="relative h-[320px] w-full bg-[#eee] md:h-[410px]">
            <Image
              src="/legacy/onas-1420x410-1.jpg"
              alt="Farebné kvetináče"
              fill
              sizes="85vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[85vw] space-y-16 px-4 pb-20 sm:px-6 lg:max-w-[1150px]">
          <div className="grid gap-10 md:grid-cols-[0.32fr_1fr]">
            <h2 className="text-[26px] font-extrabold text-[var(--color-brown)]">Architekti a developeri</h2>
            <p className="text-[18px] font-light leading-relaxed text-[#777]">
              Široký sortiment štýlových a dizajnových kvetináčov aj od známych dizajnérov. Nakoľko fabriky vyrábajúce kvetináče majú v programe aj výrobu nábytku a iných zaujímavých produktov, ponúkame ich celý sortiment. Pre týchto záujemcov máme veľkoobchodné ceny.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-[0.32fr_1fr]">
            <h2 className="text-[26px] font-extrabold text-[var(--color-brown)]">Koncoví zákazníci</h2>
            <p className="text-[18px] font-light leading-relaxed text-[#777]">
              Každý, kto má balkón, terasu, záhradu, byt či dom, si u nás nájde kvetináče či iné produkty, ktoré sa mu dizajnovo hodia do interiéru a exteriéru. Poradíme s farbou, veľkosťou, čo vysádzať, ako vysádzať, po prípade dodáme aj záhradníka.
            </p>
          </div>

          <div className="relative h-[180px] w-full bg-[#eee] md:h-[220px]">
            <Image
              src="/legacy/onas-1420x200-1.jpg"
              alt="Katalógy"
              fill
              sizes="85vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-10 md:grid-cols-[0.32fr_1fr]">
            <h2 className="text-[26px] font-extrabold text-[var(--color-brown)]">Katalógy</h2>
            <p className="text-[18px] font-light leading-relaxed text-[#777]">
              V predajni nájdete katalógy dodávateľov a radi vám pomôžeme vybrať vhodné riešenie podľa priestoru, farby, rozmeru aj spôsobu používania.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
