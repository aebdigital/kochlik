'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Slide = {
  title: string;
  text: string;
  image: string;
  href: string;
};

const slides: Slide[] = [
  {
    title: 'Dizajnové kvetináče',
    text: 'Vášmu domovu, záhrade alebo firme dodajú osobitný charakter a ich nezvyčajné tvary pôsobia výnimočne a v každom návštevníkovi zanechajú silný dojem.',
    image: '/legacy/pot1.jpg',
    href: '/product-category/dizajnove',
  },
  {
    title: 'Moderné kvetináče',
    text: 'Vášmu domovu, záhrade alebo firme dodajú osobitný charakter a ich nezvyčajné tvary pôsobia výnimočne a v každom návštevníkovi zanechajú silný dojem.',
    image: '/legacy/pot22.jpg',
    href: '/product-category/moderne-kvetinace',
  },
  {
    title: 'Klasické kvetináče',
    text: 'Vášmu domovu, záhrade alebo firme dodajú osobitný charakter a ich nezvyčajné tvary pôsobia výnimočne a v každom návštevníkovi zanechajú silný dojem.',
    image: '/legacy/pot32.jpg',
    href: '/product-category/klasicke-kvetinace',
  },
];

const AUTOPLAY_MS = 7000;

export default function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setActiveIndex(i => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused]);

  return (
    <section
      className="relative h-[64vh] min-h-[520px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.title}
            className={
              isActive
                ? 'absolute inset-0 opacity-100 transition-opacity duration-700 ease-out'
                : 'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out'
            }
            aria-hidden={!isActive}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slides.length}: ${slide.title}`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-transparent" />

            <div className="site-container relative flex h-full items-center">
              <div
                className={
                  isActive
                    ? 'max-w-[650px] animate-slide-fade-in pb-10 text-white'
                    : 'max-w-[650px] pb-10 text-white'
                }
                key={isActive ? `active-${index}` : `inactive-${index}`}
              >
                <h1 className="mb-8 text-[46px] font-extrabold uppercase leading-[1.08] tracking-normal md:text-[76px] lg:text-[86px]">
                  {slide.title}
                </h1>
                <p className="mb-12 max-w-[620px] text-[18px] font-light leading-relaxed text-white/85 md:text-[22px]">
                  {slide.text}
                </p>
                <Link
                  href={slide.href}
                  className="inline-flex h-14 items-center bg-[var(--color-brand)] px-10 text-[16px] font-light uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-brand-dark)]"
                >
                  Pozrieť
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Prejsť na ${slide.title}`}
              aria-current={isActive}
              className={
                isActive
                  ? 'h-4 w-4 rounded-full border-2 border-[var(--color-brand)] bg-transparent transition-all'
                  : 'h-2.5 w-2.5 rounded-full bg-white/80 transition-all hover:bg-white'
              }
            />
          );
        })}
      </div>
    </section>
  );
}
