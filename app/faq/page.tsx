import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';

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

export default function FaqPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container py-24">
          <h1 className="mb-8 text-center text-[30px] font-extrabold text-[var(--color-brand)]">
            Doprava
          </h1>
          <div className="space-y-0">
            {questions.map((item, index) => (
              <details key={item.question} open={index === 0} className="group border-b border-[#e5e5e5] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-8 text-[24px] font-light text-[#555] marker:hidden">
                  <span>{item.question}</span>
                  <span className="text-[30px] leading-none text-[var(--color-brown)] group-open:hidden">+</span>
                  <span className="hidden text-[30px] leading-none text-[var(--color-brown)] group-open:block">−</span>
                </summary>
                <p className="mt-5 max-w-[1560px] text-[21px] font-light leading-relaxed text-[#777]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
