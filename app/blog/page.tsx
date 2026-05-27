import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import { getBlogPosts } from '@/lib/blog';

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <>
      <Header />
      <CategoryBar />

      <main className="flex-1 bg-white">
        <section className="site-container py-24">
          <div className="mb-16 flex gap-5 text-[22px] font-light text-[#bbb]">
            <span className="text-[var(--color-brand)]">Všetko</span>
            <span>/</span>
            <span>Novinky</span>
          </div>

          {posts.length === 0 ? (
            <p className="text-[20px] font-light text-[#999]">
              Zatiaľ tu nie sú žiadne príspevky.
            </p>
          ) : (
            <div className="columns-1 gap-14 md:columns-2 xl:columns-3">
              {posts.map((post, index) => {
                const image = post.featuredImage || '/legacy/k1.jpg';
                const tall = index % 2 === 1;
                return (
                  <article key={post.slug} className="mb-14 break-inside-avoid">
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <div
                        className={
                          tall
                            ? 'relative mb-6 h-[420px] w-full overflow-hidden bg-[#f4f4f4]'
                            : 'relative mb-6 h-[300px] w-full overflow-hidden bg-[#f4f4f4]'
                        }
                      >
                        <Image
                          src={image}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 85vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="mb-5 flex items-center gap-5 text-[16px] font-light text-[#c9c9c9]">
                        <span className="h-px w-10 bg-[#dedede]" />
                        <span>{post.dateLabel}</span>
                      </div>
                      <h2 className="mb-5 text-[26px] font-extrabold leading-tight text-[var(--color-brown)] transition-colors group-hover:text-[var(--color-brand)]">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="line-clamp-4 text-[20px] font-light leading-relaxed text-[#666]">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-3 text-[18px] font-light text-[var(--color-brand)]">
                        Viac <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
