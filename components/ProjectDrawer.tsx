'use client';

import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { useProject } from './ProjectContext';
import { siteConfig } from '@/lib/seo';
import Link from 'next/link';

export default function ProjectDrawer() {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen, clearProject } = useProject();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, setIsOpen]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formattedItems = items
      .map((item, idx) => {
        const details = [];
        if (item.dimension) details.push(`Rozmer: ${item.dimension}`);
        if (item.color) details.push(`Farba: ${item.color.name}`);

        return `${idx + 1}. ${item.name}${details.length > 0 ? ` (${details.join(', ')})` : ''}\n   Množstvo: ${item.quantity} ks\n   Odkaz: ${siteConfig.siteUrl}/produkt/${item.slug}`;
      })
      .join('\n\n');

    const subject = `Projektový dopyt${projectName ? `: ${projectName}` : ''}`;
    const body = [
      `Dobrý deň,`,
      `mám záujem o vypracovanie cenovej ponuky na nasledujúce produkty pre môj projekt:`,
      '',
      formattedItems,
      '',
      `Kontaktné údaje:`,
      `Meno a priezvisko: ${name}`,
      `E-mail: ${email}`,
      phone ? `Telefón: ${phone}` : '',
      projectName ? `Názov projektu / stavby: ${projectName}` : '',
      '',
      notes ? `Poznámka / doplňujúce informácie:\n${notes}` : '',
      '',
      `Odoslané z webu ${siteConfig.name}`,
    ]
      .filter((val) => val !== '')
      .join('\n');

    window.location.href = `mailto:info@kochlik.eu?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const inputClass =
    'h-12 w-full border border-[#d9d9d9] bg-white px-4 text-[16px] font-light text-[#333] outline-none transition-colors focus:border-[var(--color-brand)]';

  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={
          isOpen
            ? 'fixed inset-0 z-[90] bg-black/30 opacity-100 backdrop-blur-sm transition-opacity duration-300'
            : 'pointer-events-none fixed inset-0 z-[90] bg-black/30 opacity-0 backdrop-blur-sm transition-opacity duration-300'
        }
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Projektový dopyt zložka"
        className={
          isOpen
            ? 'fixed right-0 top-0 z-[100] flex h-full w-full max-w-[520px] translate-x-0 flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out'
            : 'pointer-events-none fixed right-0 top-0 z-[100] flex h-full w-full max-w-[520px] translate-x-full flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out'
        }
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eee] px-8 py-6">
          <div>
            <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
              Projektová zložka
            </h2>
            <p className="mt-1 text-[14px] font-light text-[#888]">
              {items.length === 0
                ? 'Zoznam je prázdny'
                : `${items.length} ${items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktov'} v dopyte`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Zavrieť"
            className="-mr-2 -mt-2 p-2 text-[#888] transition-colors hover:text-[var(--color-brand)]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-[16px] font-light text-[#777] mb-6">
                Pridajte kvetináče do projektu pre hromadný dopyt.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-12 items-center bg-[var(--color-brand)] px-8 text-[14px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-brand-dark)]"
              >
                Pokračovať v prehliadaní
              </button>
            </div>
          ) : (
            <>
              {/* Product items list */}
              <div className="divide-y divide-[#eee]">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-gray-50 border border-[#eee] flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-[15px] leading-tight text-[var(--color-brown)] truncate">
                          <Link
                            href={`/produkt/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="hover:text-[var(--color-brand)] transition-colors"
                          >
                            {item.name}
                          </Link>
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#777] font-light">
                          {item.dimension && <span>Rozmer: {item.dimension}</span>}
                          {item.color && (
                            <span className="flex items-center gap-1.5">
                              Farba: {item.color.name}
                              {item.color.hex && (
                                <span
                                  className="inline-block w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                  style={{ backgroundColor: item.color.hex }}
                                />
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#d9d9d9] h-8 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-[#555] hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-[14px] font-light text-[#333]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-[#555] hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-sm"
                          aria-label="Odstrániť"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#eee] pt-6" />

              {/* Inquiry form */}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <h3 className="text-[16px] font-bold uppercase tracking-wide text-[var(--color-brown)] mb-1">
                    Cenový dopyt
                  </h3>
                  <p className="text-[14px] font-light text-[#777]">
                    Vyplňte kontaktné údaje a odošlite dopyt. Pripravíme pre vás cenovú ponuku s ohľadom na množstvá a dopravu.
                  </p>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Meno a priezvisko *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
                <input
                  type="email"
                  required
                  placeholder="E-mail *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
                <input
                  type="tel"
                  placeholder="Telefón"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  autoComplete="tel"
                />
                <input
                  type="text"
                  placeholder="Názov projektu / stavby (voliteľné)"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={inputClass}
                />
                <textarea
                  placeholder="Poznámka, špecifikácia projektu, termín (voliteľné)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-[#d9d9d9] bg-white px-4 py-3 text-[16px] font-light text-[#333] outline-none transition-colors focus:border-[var(--color-brand)]"
                />

                <button
                  type="submit"
                  className="h-14 w-full bg-[var(--color-brand)] text-[16px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-brand-dark)]"
                >
                  Odoslať dopyt emailom
                </button>
              </form>

              {/* Contact direct Info */}
              <div className="border-t border-[#eee] pt-6 space-y-2 text-[14px] font-light text-[#555]">
                <a
                  href="tel:+421905587986"
                  className="flex items-center gap-3 transition-colors hover:text-[var(--color-brand)]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#888]" />
                  +421 905 587 986
                </a>
                <a
                  href="mailto:info@kochlik.eu"
                  className="flex items-center gap-3 transition-colors hover:text-[var(--color-brand)]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#888]" />
                  info@kochlik.eu
                </a>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
