import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'O nás - dizajnové kvetináče Bratislava',
  description:
    'Spoznajte KOCHLIK, bratislavskú predajňu odolných talianskych dizajnových kvetináčov, nábytku a doplnkov z PE živice pre interiér aj exteriér.',
  path: '/o-nas',
  image: '/legacy/prekoho-1420x410-1.jpg',
});

const processSteps = [
  ['1. Polyetylénový prášok', 'Rotačné tvarovanie je špeciálna technika na výrobu plastových predmetov, pri ktorej sa využíva hlavne lineárny polyetylénový prášok.'],
  ['2. Hliníková forma', 'Materiál sa naleje do hliníkových foriem, ktoré sa následne umiestnia do pece.'],
  ['3. Rotačný pohyb', 'Vďaka fúzii a kombinácii rotačného pôsobenia mechanických ramien s gravitačnou silou je plast rovnomerne rozložený na stenách.'],
  ['4. Ručná extrakcia', 'Následne sa forma ochladí a začne proces tuhnutia. Predmet sa manuálne extrahuje z formy.'],
  ['5. Lakovanie', 'Povrchy sú dokončené remeselnými technikami, po ktorých nasleduje proces maľovania.'],
  ['6. Konečný produkt', 'Rotačné tvarovanie je priemyselná technika, ktorá umožňuje výrobu niekoľkých desiatok kusov denne a vyžaduje zručnosť špecializovaných technikov.'],
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="mx-auto w-full max-w-[85vw] lg:max-w-[1150px] px-4 sm:px-6 py-20">
          <h1 className="mb-16 max-w-[1320px] text-[36px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[44px]">
            Za nezvyčajnými vlastnosťami kvetináčov sa ukrýva PE živica, z ktorej sú vyrobené.
          </h1>

          <div className="mb-20 grid gap-10 md:grid-cols-[0.32fr_1fr]">
            <h2 className="text-[26px] font-extrabold text-[var(--color-brown)]">O nás</h2>
            <p className="text-[18px] font-light leading-[1.5]">
              Kochlik je predajňa kvalitných, ľahkých a odolných kvetináčov od talianskych dizajnérov určených do exteriéru aj interiéru. Okrem dizajnových kvetináčov však ponúka aj kvalitný taliansky nábytok a rôzne produkty pre obchodné centrá, hotely, kúpaliská a wellness zariadenia.
            </p>
          </div>

          <div className="relative mb-20 h-[320px] w-full bg-[#eee] md:h-[410px]">
            <Image
              src="/legacy/prekoho-1420x410-1.jpg"
              alt="Výroba kvetináčov"
              fill
              sizes="85vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-14">
            <div className="grid gap-10 md:grid-cols-[0.32fr_1fr]">
              <h2 className="text-[26px] font-extrabold text-[var(--color-brown)]">Výroba a materiál</h2>
              <p className="text-[18px] font-light leading-[1.5]">
                Skutočná revolúcia spracovania plastov s <strong className="font-extrabold text-[var(--color-brown)]">technikou rotačného formovania</strong> dovezenou z USA, dala pôvod nespočetným talianskym dizajnovým predmetom, ako sú interiérové či exteriérové kvetináče, vonkajšie osvetlenie, ale aj moderný nábytok.
              </p>
            </div>

            {processSteps.map(([title, text]) => (
              <div key={title} className="grid gap-10 md:grid-cols-[0.32fr_1fr]">
                <h3 className="text-[22px] font-light">{title}</h3>
                <p className="text-[18px] font-light leading-[1.5]">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
