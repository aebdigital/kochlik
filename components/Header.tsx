'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, Phone, Mail, MapPin, Loader2 } from 'lucide-react';

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

  const navLinks = [
    ['Pre koho', '/pre-koho'],
    ['O nás', '/o-nas'],
    ['Referencie', '/referencie'],
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
            <mark key={i} className="bg-[var(--color-brand)]/35 text-white font-semibold rounded-sm px-0.5">
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
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      {/* Top bar info (desktop only) */}
      <div className="hidden border-b border-[#eee] bg-[#ebe9e9] text-[13px] text-[#555] md:block">
        <div className="site-container flex h-9 items-center justify-between">
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
      <div className="site-container flex h-24 items-center justify-between relative">
        <Link href="/" className="z-50 block shrink-0" aria-label="KOCHLIK domov">
          <Image
            src="/legacy/logo.svg"
            alt="KOCHLIK"
            width={236}
            height={56}
            priority
            className="h-[42px] w-auto md:h-[48px]"
          />
        </Link>

        <nav className="hidden items-center gap-12 md:flex">
          {navLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-[20px] font-light text-[#5f5f5f] transition-colors hover:text-[var(--color-brand)]"
            >
              {label}
            </Link>
          ))}
          <button
            aria-label="Vyhľadávanie"
            onClick={openSearch}
            className="text-[#282828] transition-colors hover:text-[var(--color-brand)] cursor-pointer"
          >
            <Search className="h-7 w-7" strokeWidth={1.8} />
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

      {/* Centered Liquid Glass Search Modal */}
      {isSearchOpen && (
        <>
          {/* Backdrop overlay - dark blur all around */}
          <div
            onClick={closeSearch}
            className="fixed inset-0 bg-[#070708]/30 backdrop-blur-xl z-[60] animate-fade-in"
          />

          {/* Modal Container */}
          <div
            onClick={closeSearch}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 pointer-events-none"
          >
            {/* Liquid Glass Modal Card */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[80vh] md:max-h-[70vh] bg-white/[0.06] border border-white/10 backdrop-blur-3xl shadow-[0_32px_80px_-10px_rgba(0,0,0,0.7)] rounded-3xl flex flex-col text-white relative overflow-hidden pointer-events-auto animate-scale-in"
            >
              {/* Background glowing liquid spots for glass depth */}
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--color-brand)]/15 rounded-full blur-[110px] pointer-events-none" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#88b23f]/10 rounded-full blur-[110px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#331f1e]/30 rounded-full blur-[120px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeSearch}
                className="absolute right-5 top-5 text-white/50 hover:text-white transition-colors cursor-pointer z-10 p-1 hover:bg-white/5 rounded-full"
                aria-label="Zatvoriť vyhľadávanie"
              >
                <X className="h-6 w-6" strokeWidth={1.8} />
              </button>

              {/* Input Area */}
              <div className="p-6 md:p-8 pb-4 border-b border-white/10 shrink-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Vyhľadávanie
                </h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Vyhľadajte kvetináče, nábytok alebo značky..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-10 bg-white/5 border border-white/10 rounded-2xl text-base md:text-lg font-light text-white placeholder-white/35 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] shadow-inner transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 hover:text-white transition-colors cursor-pointer"
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
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/40">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand)]" />
                    <span className="text-sm font-light">Načítavam produkty...</span>
                  </div>
                ) : searchQuery.trim() === '' ? (
                  // Empty query - show guidance & quick categories
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                        Ako začať
                      </h3>
                      <p className="text-white/70 font-light text-sm md:text-base mb-6 leading-relaxed">
                        Zadajte názov kvetináča (napr. <span className="font-normal text-[var(--color-brand)]">etria</span>, <span className="font-normal text-[var(--color-brand)]">kube</span>), značku alebo kategóriu. Vyhľadávanie prebieha okamžite počas písania.
                      </p>
                    </div>
                    <div className="flex flex-col gap-6 md:border-l md:border-white/10 md:pl-8">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                          Rýchle kategórie
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href="/product-category/dizajnove"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Dizajnové
                          </Link>
                          <Link
                            href="/product-category/moderne-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Moderné
                          </Link>
                          <Link
                            href="/product-category/svietiace-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Svietiace
                          </Link>
                          <Link
                            href="/product-category/nabytok"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Nábytok
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  // No Results State
                  <div className="flex flex-col items-center justify-center py-12 text-center text-white/60">
                    <span className="text-4xl mb-4">🔍</span>
                    <h3 className="text-base font-normal mb-1">
                      Nenašli sa žiadne produkty
                    </h3>
                    <p className="text-xs font-light text-white/40">
                      Pre výraz &quot;{searchQuery}&quot; sme nenašli žiadnu zhodu. Skúste iné kľúčové slovo.
                    </p>
                  </div>
                ) : (
                  // Products Found
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                        Produkty ({filteredProducts.length})
                      </h3>
                      <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-2 no-scrollbar">
                        {filteredProducts.map(product => (
                          <Link
                            key={product.slug}
                            href={`/produkt/${product.slug}`}
                            onClick={closeSearch}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-150"
                          >
                            <div className="relative h-14 w-14 bg-white/5 rounded-lg overflow-hidden shrink-0 border border-white/10 flex items-center justify-center p-1">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="56px"
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="text-[11px] uppercase tracking-wider text-white/40 font-medium leading-none mb-1">
                                {product.brand}
                              </div>
                              <h4 className="text-sm md:text-base font-normal text-white truncate leading-snug hover:text-[var(--color-brand)] transition-colors">
                                {highlightText(product.name, searchQuery)}
                              </h4>
                              <div className="text-[11px] text-white/40 leading-none mt-1">
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
                    <div className="flex flex-col gap-6 md:border-l md:border-white/10 md:pl-8 hidden md:flex">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                          Rýchle kategórie
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href="/product-category/dizajnove"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Dizajnové kvetináče
                          </Link>
                          <Link
                            href="/product-category/moderne-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Moderné kvetináče
                          </Link>
                          <Link
                            href="/product-category/svietiace-kvetinace"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Svietiace kvetináče
                          </Link>
                          <Link
                            href="/product-category/nabytok"
                            onClick={closeSearch}
                            className="px-3 py-1.5 bg-white/5 hover:bg-[var(--color-brand)] hover:text-white rounded-full text-xs font-light text-white/70 border border-white/5 transition-colors"
                          >
                            Nábytok
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                          Záruka kvality
                        </h3>
                        <p className="text-xs font-light text-white/50 leading-relaxed">
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
    </header>
  );
}


