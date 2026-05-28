import { BriefcaseBusiness, MessagesSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import ContactForm from '@/components/ContactForm';
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
        {/* Map – full width above content */}
        <div className="h-[400px] w-full overflow-hidden bg-[#eee]">
          <iframe
            title="Mapa predajne KOCHLIK"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.130609790608!2d17.119920515692254!3d48.14628715853328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c8947739e01b9%3A0x8aaebc5c9b9fef89!2sKOCHLIK!5e0!3m2!1ssk!2ssk!4v1700000000000!5m2!1ssk!2ssk"
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <section className="mx-auto w-full max-w-[85vw] px-4 py-20 sm:px-6 lg:max-w-[1150px]">
          <h1 className="mb-14 text-[32px] font-extrabold leading-tight text-[var(--color-brown)] md:text-[40px]">
            Veľmi radi vás u nás uvidíme.
          </h1>

          <div className="grid gap-16 lg:grid-cols-[0.4fr_0.6fr]">
            {/* LEFT – Contact info */}
            <div className="space-y-12">
              <div className="grid grid-cols-[36px_1fr] gap-5">
                <MessagesSquare className="mt-0.5 h-6 w-6 text-[#333]" strokeWidth={1.4} />
                <div>
                  <h2 className="mb-4 text-[22px] font-extrabold text-[var(--color-brown)]">Kontaktné údaje</h2>
                  <div className="space-y-4 text-[18px] font-light leading-[1.55] text-[#777]">
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

              <div className="grid grid-cols-[36px_1fr] gap-5">
                <BriefcaseBusiness className="mt-0.5 h-6 w-6 text-[#333]" strokeWidth={1.4} />
                <div>
                  <h2 className="mb-4 text-[22px] font-extrabold text-[var(--color-brown)]">Fakturačné údaje</h2>
                  <p className="text-[18px] font-light leading-[1.55] text-[#777]">
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

            {/* RIGHT – Contact form */}
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
