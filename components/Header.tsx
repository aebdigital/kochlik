'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, Phone, Mail, MapPin } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    ['Pre koho', '/pre-koho'],
    ['O nás', '/o-nas'],
    ['Referencie', '/referencie'],
    ['Blog', '/blog'],
    ['FAQ', '/faq'],
    ['Kontakt', '/kontakt'],
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
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

      <div className="site-container flex h-24 items-center justify-between">
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
          <button aria-label="Vyhľadávanie" className="text-[#282828] transition-colors hover:text-[var(--color-brand)]">
            <Search className="h-7 w-7" strokeWidth={1.8} />
          </button>
        </nav>

        <div className="z-50 flex items-center gap-5 md:hidden">
          <button aria-label="Vyhľadávanie" className="text-[#282828] hover:text-[var(--color-brand)]">
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
    </header>
  );
}
