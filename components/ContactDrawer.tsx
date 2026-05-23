'use client';

import { useEffect, useState } from 'react';
import { X, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactDrawer({
  productName,
  productUrl,
}: {
  productName: string;
  productUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`Mám záujem o produkt: ${productName}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = `Dopyt: ${productName}`;
    const body = [
      `Produkt: ${productName}`,
      `Odkaz: ${productUrl}`,
      '',
      `Meno: ${name}`,
      `E-mail: ${email}`,
      `Telefón: ${phone}`,
      '',
      'Správa:',
      message,
    ].join('\n');
    window.location.href = `mailto:info@kochlik.eu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const inputClass =
    'h-12 w-full border border-[#d9d9d9] bg-white px-4 text-[16px] font-light text-[#333] outline-none transition-colors focus:border-[var(--color-brand)]';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-14 items-center bg-[var(--color-brand)] px-12 text-[16px] font-light uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-brand-dark)]"
      >
        Mám záujem
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={
          open
            ? 'fixed inset-0 z-[90] bg-black/30 opacity-100 backdrop-blur-sm transition-opacity duration-300'
            : 'pointer-events-none fixed inset-0 z-[90] bg-black/30 opacity-0 backdrop-blur-sm transition-opacity duration-300'
        }
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mám záujem o produkt"
        className={
          open
            ? 'fixed right-0 top-0 z-[100] flex h-full w-full max-w-[480px] translate-x-0 flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out'
            : 'pointer-events-none fixed right-0 top-0 z-[100] flex h-full w-full max-w-[480px] translate-x-full flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out'
        }
      >
        <div className="flex items-start justify-between border-b border-[#eee] px-8 py-6">
          <div>
            <h2 className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-brown)]">
              Mám záujem
            </h2>
            <p className="mt-1 text-[14px] font-light text-[#888]">{productName}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Zavrieť"
            className="-mr-2 -mt-2 p-2 text-[#888] transition-colors hover:text-[var(--color-brand)]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
          <div className="space-y-3 text-[15px] font-light text-[#555]">
            <a
              href="tel:+421905587986"
              className="flex items-center gap-3 transition-colors hover:text-[var(--color-brand)]"
            >
              <Phone className="h-4 w-4 shrink-0" />
              +421 905 587 986
            </a>
            <a
              href="mailto:info@kochlik.eu"
              className="flex items-center gap-3 transition-colors hover:text-[var(--color-brand)]"
            >
              <Mail className="h-4 w-4 shrink-0" />
              info@kochlik.eu
            </a>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Ulica 29. augusta 28
                <br />
                Bratislava 841 09
              </span>
            </div>
          </div>

          <div className="border-t border-[#eee]" />

          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-[14px] font-light text-[#777]">
              Vyplňte formulár a my sa vám ozveme s ponukou a termínom dodania.
            </p>
            <input
              type="text"
              required
              placeholder="Meno a priezvisko"
              value={name}
              onChange={event => setName(event.target.value)}
              className={inputClass}
              autoComplete="name"
            />
            <input
              type="email"
              required
              placeholder="E-mail"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className={inputClass}
              autoComplete="email"
            />
            <input
              type="tel"
              placeholder="Telefón"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              className={inputClass}
              autoComplete="tel"
            />
            <textarea
              required
              placeholder="Správa"
              value={message}
              onChange={event => setMessage(event.target.value)}
              rows={5}
              className="w-full border border-[#d9d9d9] bg-white px-4 py-3 text-[16px] font-light text-[#333] outline-none transition-colors focus:border-[var(--color-brand)]"
            />
            <button
              type="submit"
              className="h-14 w-full bg-[var(--color-brand)] text-[18px] font-light uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-brand-dark)]"
            >
              Odoslať dopyt
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
