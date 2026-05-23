import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container max-w-[1100px] py-24">
          <h1 className="mb-8 text-[42px] font-extrabold uppercase leading-tight text-[var(--color-brown)]">
            Ochrana osobných údajov
          </h1>
          <div className="space-y-6 text-[20px] font-light leading-relaxed text-[#666]">
            <p>
              Osobné údaje spracúvame len v rozsahu potrebnom na vybavenie dopytu, objednávky alebo komunikácie so zákazníkom.
            </p>
            <p>
              Ak máte otázky k spracúvaniu osobných údajov, kontaktujte nás e-mailom alebo telefonicky.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
