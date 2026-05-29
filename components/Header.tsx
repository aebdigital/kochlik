'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, Phone, Mail, MapPin, Loader2, Folder } from 'lucide-react';
import { useProject } from '@/components/ProjectContext';
import ProjectDrawer from '@/components/ProjectDrawer';

interface SearchProduct {
  name: string;
  slug: string;
  image: string;
  price: string;
  brand: string;
  category: string;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollYRef = useRef(0);
  const topBarVisibleRef = useRef(true);
  const scrollSettleUntilRef = useRef(0);
  const touchYRef = useRef<number | null>(null);
  const { setIsOpen, itemCount } = useProject();

  const navLinks = [
    ['Pre koho', '/pre-koho'],
    ['O nás', '/o-nas'],
    ['Blog', '/blog'],
    ['FAQ', '/faq'],
    ['Kontakt', '/kontakt'],
  ];

  // Fetch catalog client-side on search activation
  const openSearch = async () => {
    setIsSearchOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open

    if (!hasFetched) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setHasFetched(true);
        }
      } catch (err) {
        console.error('Failed to load products for search', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Focus input when search is opened
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const updateStickyOffset = (visible: boolean) => {
      document.documentElement.style.setProperty('--kochlik-sticky-offset', visible ? '7rem' : '5rem');
      headerRef.current?.setAttribute('data-topbar-visible', visible ? 'true' : 'false');
    };

    const setTopBarVisibility = (visible: boolean, settle = true) => {
      if (topBarVisibleRef.current === visible) {
        return;
      }

      topBarVisibleRef.current = visible;
      updateStickyOffset(visible);

      if (settle) {
        scrollSettleUntilRef.current = performance.now() + 360;
      }
    };

    updateStickyOffset(true);
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      if (currentY < 12) {
        lastScrollYRef.current = currentY;
        setTopBarVisibility(true, false);
        return;
      }

      if (performance.now() < scrollSettleUntilRef.current) {
        lastScrollYRef.current = currentY;
        return;
      }

      if (Math.abs(currentY - lastY) < 8) {
        return;
      }

      const nextVisible = currentY < lastY;
      lastScrollYRef.current = currentY;
      setTopBarVisibility(nextVisible);
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 4) {
        return;
      }

      lastScrollYRef.current = window.scrollY;
      setTopBarVisibility(event.deltaY < 0);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const previousY = touchYRef.current;
      const currentY = event.touches[0]?.clientY ?? null;

      if (previousY === null || currentY === null || Math.abs(currentY - previousY) < 8) {
        return;
      }

      lastScrollYRef.current = window.scrollY;
      setTopBarVisibility(currentY > previousY);
      touchYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      document.documentElement.style.removeProperty('--kochlik-sticky-offset');
    };
  }, []);

  // Lock body scroll when search is active
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Close search on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  // Filter products by query
  const filteredProducts = searchQuery.trim() === ''
    ? []
    : products.filter(product => {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          (product.brand && product.brand.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
        );
      });

  // Highlight matches
  function highlightText(text: string, highlight: string) {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-[var(--color-brand)]/20 text-[#282828] font-semibold rounded-sm px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  }

  return (
    <header
      ref={headerRef}
      data-topbar-visible="true"
      className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]"
    >
      {/* Top bar info (desktop only) */}
      <div className="kochlik-topbar hidden max-h-8 overflow-hidden border-b border-[#eee] bg-[#ebe9e9] text-[13px] text-[#555] opacity-100 transition-[max-height,opacity,transform,border-width] duration-300 ease-out md:block">
        <div className="site-container flex h-8 items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+421905587986" className="inline-flex items-center gap-1 hover:text-[var(--color-brand)]">
              <Phone className="h-3.5 w-3.5" />
              +421 905 587 986
            </a>
            <a href="mailto:info@kochlik.eu" className="inline-flex items-center gap-1 hover:text-[var(--color-brand)]">
              <Mail className="h-3.5 w-3.5" />
              info@kochlik.eu
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Ulica 29. augusta 28, 811 09 Bratislava
            </span>
            <a href="https://www.facebook.com/kochlikba" aria-label="Facebook" className="hover:text-[var(--color-brand)]">
              <span className="text-[14px] font-extrabold leading-none">f</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="site-container flex h-20 items-center justify-between relative">
        <Link href="/" className="z-50 block shrink-0" aria-label="KOCHLIK domov">
          <Image
            src="/legacy/logo.svg"
            alt="KOCHLIK"
            width={236}
            height={56}
            priority
            className="h-[34px] w-auto md:h-[38px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-[17px] font-light text-[#5f5f5f] transition-colors hover:text-[var(--color-brand)]"
            >
              {label}
            </Link>
          ))}
          <button
            aria-label="Vyhľadávanie"
            onClick={openSearch}
            className="text-[#282828] transition-colors hover:text-[var(--color-brand)] cursor-pointer"
          >
            <Search className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <button
            aria-label="Projektová zložka"
            onClick={() => setIsOpen(true)}
            className="h-11 flex items-center gap-3 px-6 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold text-[16px] transition-colors cursor-pointer"
          >
            <div className="relative inline-block">
              <Folder className="h-5 w-5 text-white" strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span>Môj projekt</span>
          </button>
        </nav>

        <div className="z-50 flex items-center gap-5 md:hidden">
          <button
            aria-label="Vyhľadávanie"
            onClick={openSearch}
            className="text-[#282828] hover:text-[var(--color-brand)] cursor-pointer"
          >
            <Search className="h-6 w-6" />
          </button>
          <button
            aria-label="Projektová zložka"
            onClick={() => setIsOpen(true)}
            className="text-[#282828] hover:text-[var(--color-brand)] cursor-pointer relative animate-fade-in"
          >
            <Folder className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-brand)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {itemCount}
              </span>
            )}
          </button>
          <button
            aria-label="Menu"
            className="text-[#282828] hover:text-[var(--color-brand)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Normal menu) */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-[#eee] bg-white shadow-lg md:hidden">
          <div className="flex flex-col py-4">
            {navLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="px-6 py-3 text-lg font-light text-[#555] hover:bg-gray-50 hover:text-[var(--color-brand)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Centered White Search Modal */}
      {isSearchOpen && (
        <>
          {/* Backdrop overlay - dark blur all around */}
          <div
            onClick={closeSearch}
            className="fixed inset-0 bg-[#070708]/35 backdrop-blur-md z-[60] animate-fade-in"
          />

          {/* Modal Container */}
          <div
            onClick={closeSearch}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 pointer-events-none"
          >
            {/* White Modal Card */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[80vh] md:max-h-[70vh] bg-white border border-gray-100/90 shadow-[0_32px_80px_-10px_rgba(0,0,0,0.18)] rounded-3xl flex flex-col text-[#282828] relative overflow-hidden pointer-events-auto animate-scale-in"
            >
              {/* Close Button */}
              <button
                onClick={closeSearch}
                className="absolute right-5 top-5 text-[#888] hover:text-[#282828] hover:bg-gray-100 transition-all cursor-pointer z-10 p-1.5 rounded-full"
                aria-label="Zatvoriť vyhľadávanie"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>

              {/* Input Area */}
              <div className="p-6 md:p-8 pb-4 border-b border-gray-100 shrink-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Vyhľadávanie
                </h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Vyhľadajte kvetináče, nábytok alebo značky..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-10 bg-[#f9f9f9] border border-gray-200/80 rounded-2xl text-base md:text-lg font-light text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] shadow-sm transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      aria-label="Vymazať vyhľadávanie"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results Content Area */}
              <div className="flex-grow overflow-y-auto p-6 md:p-8 pt-4 no-scrollbar">
                {isLoading ? (
                  // Loading State
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand)]" />
                    <span className="text-sm font-light text-gray-500">Načítavam produkty...</span>
                  </div>
                ) : searchQuery.trim() === '' ? (
                  // Empty query - show guidance & quick categories
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                        Ako začať
                      </h3>
                      <p className="text-gray-600 font-light text-sm md:text-base mb-6 leading-relaxed">
                        Zadajte názov kvetináča (napr. <span className="font-normal text-[var(--color-brand)]">etria</span>, <span className="font-normal text-[var(--color-brand)]">kube</span>), značku alebo kategóriu. Vyhľadávanie prebieha okamžite počas písania.
                      </p>
                    </div>
                    <div className="flex flex-col gap-6 md:border-l md:border-gray-100 md:pl-8">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                          Rýchle kategórie
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href="/produkt-kategoria/dizajnove"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Dizajnové
                          </Link>
                          <Link
                            href="/produkt-kategoria/moderne-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Moderné
                          </Link>
                          <Link
                            href="/produkt-kategoria/svietiace-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Svietiace
                          </Link>
                          <Link
                            href="/produkt-kategoria/nabytok"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Nábytok
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  // No Results State
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <span className="text-4xl mb-4">🔍</span>
                    <h3 className="text-base font-normal mb-1">
                      Nenašli sa žiadne produkty
                    </h3>
                    <p className="text-xs font-light text-gray-400">
                      Pre výraz &quot;{searchQuery}&quot; sme nenašli žiadnu zhodu. Skúste iné kľúčové slovo.
                    </p>
                  </div>
                ) : (
                  // Products Found
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                        Produkty ({filteredProducts.length})
                      </h3>
                      <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-2 no-scrollbar">
                        {filteredProducts.map(product => (
                          <Link
                            key={product.slug}
                            href={`/produkt/${product.slug}`}
                            onClick={closeSearch}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-150"
                          >
                            <div className="relative h-14 w-14 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="56px"
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium leading-none mb-1">
                                {product.brand}
                              </div>
                              <h4 className="text-sm md:text-base font-normal text-gray-800 truncate leading-snug hover:text-[var(--color-brand)] transition-colors">
                                {highlightText(product.name, searchQuery)}
                              </h4>
                              <div className="text-[11px] text-gray-400 leading-none mt-1">
                                {product.category}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm md:text-base font-semibold text-[var(--color-brand)]">
                                {product.price}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 md:border-l md:border-gray-100 md:pl-8 hidden md:flex">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                          Rýchle kategórie
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href="/produkt-kategoria/dizajnove"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Dizajnové kvetináče
                          </Link>
                          <Link
                            href="/produkt-kategoria/moderne-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Moderné kvetináče
                          </Link>
                          <Link
                            href="/produkt-kategoria/svietiace-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Svietiace kvetináče
                          </Link>
                          <Link
                            href="/produkt-kategoria/nabytok"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-gray-600 border border-gray-200/60 transition-colors"
                          >
                            Nábytok
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                          Záruka kvality
                        </h3>
                        <p className="text-xs font-light text-gray-500 leading-relaxed">
                          Všetky naše produkty sú dovážané priamo od renomovaných talianskych výrobcov, predovšetkým Euro3plast (Plust Collection).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <ProjectDrawer />
    </header>
  );
}
