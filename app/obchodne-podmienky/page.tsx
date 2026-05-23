import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';

export default function TermsPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container max-w-[1100px] py-24">
          <h1 className="mb-8 text-[42px] font-extrabold uppercase leading-tight text-[var(--color-brown)]">
            Všeobecné obchodné podmienky
          </h1>
          <div className="space-y-6 text-[20px] font-light leading-relaxed text-[#666]">
            <p>
              Produkty sú ponúkané podľa aktuálnej dostupnosti. Pri väčších projektoch alebo špecifických modeloch odporúčame overiť dostupnosť a termín dodania vopred.
            </p>
            <p>
              Ceny a technické informácie pri produktoch slúžia ako orientačný katalógový prehľad. Presnú ponuku vám radi pripravíme po kontaktovaní predajne.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
