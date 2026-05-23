import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';

const posts = [
  {
    title: 'Kvetináče Flow od Zaha Hadid',
    text: 'ZAHA HADID sa venovala nielen architektúre ale aj dizajnu. V spolupráci s talianskou fabrikou Serralunga navrhla kvetináče FLOW-L a FLOW-M, ktoré sú presne také ako jej architektúra.',
    image: '/legacy/blog/zaha-hadid-v-ext.jpg',
    tall: false,
  },
  {
    title: 'Symbióza záhradného architekta a dekoratívnej nádoby',
    text: 'Pri umiestnení interiérových či exteriérových rastlín si môžete vybrať zo širokej škály atraktívnych a nezvyčajných kvetináčov z PE živice, ktoré ponúka firma KOCHLIK.',
    image: '/legacy/k1.jpg',
    tall: true,
  },
  {
    title: 'Jar je v plnom prúde',
    text: 'Jar je v plnom prúde a teraz je správny čas vysadiť si nielen letničky ale aj trvalky alebo ihličnany. Aj menší balkón vie získať výrazný charakter.',
    image: '/legacy/blog/kube-slim-verde-acido.jpg',
    tall: false,
  },
  {
    title: 'Nové kvetináče od firmy KOCHLIK',
    text: 'Už je tu jar, slniečko konečne svieti, sneh sa roztopil a zem začína dýchať. Fabriky pripravili nové tvary, ktoré zapadnú do interiéru aj exteriéru.',
    image: '/images/kvetinac-kube/kvetinac-kube_1.webp',
    tall: true,
  },
  {
    title: 'Exteriérové živicové kvetináče z firmy Kochlik',
    text: 'Tieto živicové kvetináče sú extra odolné voči mrazu, UV žiareniu a mechanickému poškodeniu, sú ľahké a preto sa s nimi dobre pracuje.',
    image: '/images/hrantik-hladky-cassetta-liscia/hrantik-hladky-cassetta-liscia_1.webp',
    tall: false,
  },
  {
    title: 'Rustikálne kvetináče od firmy Kochlik',
    text: 'Súčasná doba je moderná, ale niekto má rád aj klasickú atmosféru. Rustikálne tvary dokážu do záhrady pridať pokojný a prirodzený výraz.',
    image: '/images/kvetinac-orcio-festonato/kvetinac-orcio-festonato_1.jpg',
    tall: true,
  },
  {
    title: 'Zaujímavý kvetináč UNFIORE od firmy Kochlik',
    text: 'Kvetináč UNFIORE má zaujímavý dizajn a vyrába sa vo viacerých základných farbách. Na objednávku je možné pripraviť aj ďalšie farebné prevedenia.',
    image: '/images/kvetinac-kiam/kvetinac-kiam_1.webp',
    tall: false,
  },
  {
    title: 'Kvetináč ako moderný prvok v architektúre',
    text: 'Kvetináč už nie je len nádoba, do ktorej sa vysadí rastlina. Plní estetickú funkciu a pomáha zvýrazniť charakter priestoru.',
    image: '/images/kvetinac-kabin/kvetinac-kabin_1.webp',
    tall: true,
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container py-24">
          <div className="mb-24 flex gap-5 text-[22px] font-light text-[#bbb]">
            <span className="text-[var(--color-brand)]">Všetko</span>
            <span>/</span>
            <span>Novinky</span>
          </div>

          <div className="columns-1 gap-14 md:columns-2 xl:columns-3">
            {posts.map(post => (
              <article key={post.title} className="mb-14 break-inside-avoid">
                <div className={post.tall ? 'relative mb-6 h-[420px] w-full bg-[#f4f4f4]' : 'relative mb-6 h-[300px] w-full bg-[#f4f4f4]'}>
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 85vw"
                    className="object-cover"
                  />
                </div>
                <div className="mb-5 flex items-center gap-5 text-[16px] font-light text-[#c9c9c9]">
                  <span className="h-px w-10 bg-[#dedede]" />
                  <span>4. novembra 2025</span>
                </div>
                <h2 className="mb-5 text-[26px] font-extrabold leading-tight text-[var(--color-brown)]">{post.title}</h2>
                <p className="text-[22px] font-light leading-relaxed text-[#666]">{post.text}</p>
                <span className="mt-6 inline-flex items-center gap-3 text-[20px] font-light text-[var(--color-brand)]">
                  Viac <span aria-hidden="true">→</span>
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
