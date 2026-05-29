import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryBar from '@/components/CategoryBar';
import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from '@/lib/blog';
import { createBlogPostingJsonLd, createBreadcrumbJsonLd, createMetadata, truncateDescription } from '@/lib/seo';

export function generateStaticParams() {
  return getBlogPosts().map(post => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return createMetadata({
    title: post.title,
    description: truncateDescription(post.excerpt || post.contentText),
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
    type: 'article',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedBlogPosts(post, 3);
  const postJsonLd = createBlogPostingJsonLd(post);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: 'Domov', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <Header />
      <CategoryBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />

      <main className="flex-1 bg-white">
        <article className="mx-auto w-full max-w-[85vw] lg:max-w-[50vw] px-4 sm:px-6 py-20">
          <h1 className="mb-6 max-w-[900px] text-[36px] font-extrabold leading-[1.15] text-[var(--color-brown)] md:text-[48px]">
            {post.title}
          </h1>

          <div className="mb-10 flex items-center gap-5 text-[15px] font-light text-[#aaa]">
            <span className="h-px w-10 bg-[#dedede]" />
            <span>{post.dateLabel}</span>
          </div>

          <div
            className="blog-content text-[18px] font-light leading-[1.55]"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {related.length > 0 && (
          <section className="mx-auto w-full max-w-[85vw] px-4 py-20 sm:px-6 lg:max-w-[1150px] border-t border-[#eee]">
            <h2 className="mb-10 text-[28px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
              Mohlo by vás zaujímať
            </h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {related.map(other => {
                const image = other.featuredImage || '/legacy/k1.jpg';
                return (
                  <Link key={other.slug} href={`/blog/${other.slug}`} className="group block">
                    <div className="relative mb-5 h-[260px] w-full overflow-hidden bg-[#f4f4f4]">
                      <Image
                        src={image}
                        alt={other.title}
                        fill
                        sizes="(min-width: 768px) 30vw, 85vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mb-2 text-[14px] font-light text-[#c9c9c9]">{other.dateLabel}</div>
                    <h3 className="text-[20px] font-extrabold leading-tight text-[var(--color-brown)] transition-colors group-hover:text-[var(--color-brand)]">
                      {other.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
