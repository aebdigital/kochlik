import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import FaqAccordion from '@/components/FaqAccordion';
import { createFaqJsonLd, createMetadata } from '@/lib/seo';

const questions = [
  {
    question: 'Za ako dlho mi dodáte objednaný tovar?',
    answer: 'Záleží či ste na začiatku objednávky alebo na konci. Niekedy sa stáva, že máme otvorenú objednávku vo fabrike, tovar majú vyrobený a tak ho vieme doviezť do týždňa. Niekedy sa však čaká, hlavne na začiatku a na konci sezóny, i mesiac. S každým klientom komunikujeme osobne a informujeme ho.',
  },
  {
    question: 'Koľko si účtujete za dopravu?',
    answer: 'Cena dopravy závisí od rozmeru, množstva a adresy doručenia. Pri objednávke vám ju vždy potvrdíme vopred.',
  },
  {
    question: 'Je možné si nechať produkty priniesť na konkrétnu adresu?',
    answer: 'Áno, produkty vieme po dohode doručiť na konkrétnu adresu.',
  },
  {
    question: 'Zasielate produkty aj mimo Bratislavy?',
    answer: 'Áno, tovar dodávame aj mimo Bratislavy. Podmienky závisia od konkrétnej objednávky.',
  },
  {
    question: 'Sú kvetináče opatrené transportným obalom proti poškodeniu?',
    answer: 'Áno, pri preprave dbáme na bezpečné zabalenie produktov, aby sa minimalizovalo riziko poškodenia.',
  },
];

export const metadata = createMetadata({
  title: 'Časté otázky o objednávkach a doprave',
  description:
    'Odpovede na časté otázky o dodaní, doprave, balení a objednávaní dizajnových kvetináčov KOCHLIK v Bratislave aj mimo Bratislavy.',
  path: '/faq',
});

export default function FaqPage() {
  const faqJsonLd = createFaqJsonLd(questions);

  return (
    <>
      <Header />
      <CategoryBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="flex-1 bg-white">
        <section className="mx-auto w-full max-w-[85vw] px-4 py-24 sm:px-6 lg:max-w-[1150px]">
          <h1 className="mb-14 text-[36px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[44px]">
            Odpovede na najčastejšie otázky o nákupe, objednávkach a doprave.
          </h1>
          <FaqAccordion questions={questions} />
        </section>
      </main>

      <Footer />
    </>
  );
}
