import { BriefcaseBusiness, MessagesSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import { createBreadcrumbJsonLd, createMetadata, siteConfig } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Kontakt a predajňa v Bratislave',
  description:
    'Kontaktujte KOCHLIK v Bratislave. Navštívte predajňu na Ulici 29. augusta 28 alebo sa informujte o dizajnových kvetináčoch a nábytku telefonicky či e-mailom.',
  path: '/kontakt',
  image: '/legacy/kochlik-predajna.jpg',
});

export default function ContactPage() {
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: 'Domov', path: '/' },
    { name: 'Kontakt', path: '/kontakt' },
  ]);

  return (
    <>
      <Header />
      <CategoryBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="flex-1 bg-white">
        <section className="site-container py-24">
          <h1 className="mb-16 text-[36px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[44px]">
            Veľmi radi vás u nás uvidíme.
          </h1>

          <div className="mb-16 grid gap-16 md:grid-cols-2">
            <div className="grid grid-cols-[44px_1fr] gap-6">
              <MessagesSquare className="mt-1 h-8 w-8 text-[#333]" strokeWidth={1.4} />
              <div>
                <h2 className="mb-6 text-[28px] font-extrabold text-[var(--color-brown)]">Kontaktné údaje</h2>
                <div className="space-y-6 text-[22px] font-light leading-relaxed text-[#777]">
                  <p>
                    <a href="tel:+421905587986" className="hover:text-[var(--color-brand)]">+421 905 587 986</a>
                    <br />
                    <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-brand)] hover:text-[var(--color-brand-dark)]">{siteConfig.email}</a>
                  </p>
                  <p>
                    ul. 29. augusta 28
                    <br />
                    811 09 Bratislava
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[44px_1fr] gap-6">
              <BriefcaseBusiness className="mt-1 h-8 w-8 text-[#333]" strokeWidth={1.4} />
              <div>
                <h2 className="mb-6 text-[28px] font-extrabold text-[var(--color-brown)]">Fakturačné údaje</h2>
                <p className="text-[22px] font-light leading-relaxed text-[#777]">
                  KOCHLIK s.r.o.
                  <br />
                  IČO: 52750744
                  <br />
                  DIČ: 2121156235
                  <br />
                  IČ DPH: SK2121156235 podľa §4
                  <br />
                  Kolískova 10
                  <br />
                  841 05 Bratislava
                </p>
              </div>
            </div>
          </div>

          <div className="mb-24 h-[450px] w-full overflow-hidden bg-[#eee]">
            <iframe
              title="Mapa predajne KOCHLIK"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.130609790608!2d17.119920515692254!3d48.14628715853328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c8947739ec745%3A0x59393cb0d02f7a5b!2sUlica.%2029.Augusta%202281%2F28%2C%20811%2009%20Bratislava!5e0!3m2!1ssk!2ssk!4v1568979804077!5m2!1ssk!2ssk"
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div>
            <h2 className="mb-10 text-[36px] font-extrabold text-[var(--color-brown)]">Napíšte nám.</h2>
            <form className="space-y-8">
              <label className="block text-[22px] font-light text-[#777]">
                Vaše meno (povinné)
                <input type="text" className="mt-3 h-14 w-full border border-[#ddd] bg-white px-4 text-[18px] outline-none focus:border-[var(--color-brand)]" />
              </label>
              <label className="block text-[22px] font-light text-[#777]">
                Váš email (povinné)
                <input type="email" className="mt-3 h-14 w-full border border-[#ddd] bg-white px-4 text-[18px] outline-none focus:border-[var(--color-brand)]" />
              </label>
              <label className="block text-[22px] font-light text-[#777]">
                Vaša správa
                <textarea rows={10} className="mt-3 w-full border border-[#ddd] bg-white p-4 text-[18px] outline-none focus:border-[var(--color-brand)]" />
              </label>
              <button type="submit" className="h-14 bg-[var(--color-brand)] px-8 text-[20px] font-light text-white transition-colors hover:bg-[var(--color-brand-dark)]">
                Odoslať
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
