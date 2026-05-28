'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainImage = images[activeIndex] ?? images[0];
  const thumbs = images.slice(0, 5);

  const showPrev = useCallback(
    () => setActiveIndex(i => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const showNext = useCallback(
    () => setActiveIndex(i => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, showPrev, showNext]);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Otvoriť obrázok"
          className="relative block aspect-square w-full max-w-full cursor-zoom-in overflow-hidden bg-white"
        >
          <Image
            key={`main-${activeIndex}`}
            src={mainImage}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="animate-slide-fade-in object-cover"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 block h-5 w-5 text-[#999] before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-current after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-current"
          />
        </button>

        {thumbs.length > 1 && (
          <div className="mt-4 flex max-w-full gap-3 overflow-x-auto no-scrollbar">
            {thumbs.map((image, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Obrázok produktu ${index + 1}`}
                  aria-current={isActive}
                  className={
                    isActive
                      ? 'relative h-28 w-28 shrink-0 overflow-hidden bg-white opacity-100 outline outline-2 outline-[var(--color-brand)]'
                      : 'relative h-28 w-28 shrink-0 overflow-hidden bg-white opacity-75 transition-opacity hover:opacity-100'
                  }
                >
                  <Image src={image} alt="" fill sizes="112px" className="object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-black/90 p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            aria-label="Zavrieť"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 z-10 text-white transition-colors hover:text-[var(--color-brand)]"
          >
            <X className="h-8 w-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Predchádzajúci"
                onClick={event => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 p-3 text-white transition-colors hover:text-[var(--color-brand)] md:left-8"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                type="button"
                aria-label="Ďalší"
                onClick={event => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-3 text-white transition-colors hover:text-[var(--color-brand)] md:right-8"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <div
            className="relative h-full max-h-[88vh] w-full max-w-[1400px] animate-scale-in"
            onClick={event => event.stopPropagation()}
          >
            <Image
              key={`lightbox-${activeIndex}`}
              src={mainImage}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="animate-slide-fade-in object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[14px] font-light text-white/80">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
