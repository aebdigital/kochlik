import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import referenceImages from '@/data/reference_images.json';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Referencie dizajnových kvetináčov',
  description:
    'Fotografie realizácií a referencií s dizajnovými kvetináčmi KOCHLIK pre terasy, interiéry, hotely, reštaurácie a verejné priestory.',
  path: '/referencie',
  image: referenceImages[0] || '/legacy/kochlik-predajna.jpg',
});

export default function ReferencesPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container py-24">
          <h1 className="mb-3 text-[42px] font-extrabold leading-tight text-[var(--color-brown)]">
            Referencie
          </h1>
          <p className="mb-14 max-w-[900px] text-[18px] font-light leading-relaxed text-[#777]">
            Pozrite si fotografie od našich klientov.
          </p>
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {referenceImages.map((image, index) => (
              <div
                key={image}
                className="relative aspect-[1.45] w-full overflow-hidden bg-[#f2f2f2]"
              >
                <Image
                  src={image}
                  alt={`Referencia ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 21vw, (min-width: 640px) 42vw, 85vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
