'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Cookie } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

const STORAGE_KEY = 'kochlik-cookie-consent';

function getStoredPrefs(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storePrefs(prefs: CookiePreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/* ---- Toggle component ---- */
function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <p className="text-[16px] font-semibold text-[var(--color-brown)]">{label}</p>
        <p className="mt-1 text-[14px] font-light leading-snug text-[#777]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-[var(--color-brand)]' : 'bg-[#ccc]'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

/* ---- Settings Modal ---- */
function CookieSettingsModal({
  prefs,
  onSave,
  onClose,
}: {
  prefs: CookiePreferences;
  onSave: (p: CookiePreferences) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<CookiePreferences>(prefs);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-[480px] rounded-xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#999] transition-colors hover:text-[var(--color-brown)]"
          aria-label="Zavrieť"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <Cookie className="h-6 w-6 text-[var(--color-brand)]" />
          <h2 className="text-[22px] font-extrabold text-[var(--color-brown)]">Nastavenia cookies</h2>
        </div>

        <p className="mb-6 text-[14px] font-light leading-relaxed text-[#777]">
          Tu si môžete prispôsobiť, ktoré cookies chcete povoliť. Nevyhnutné cookies sú vždy aktívne, pretože sú potrebné pre fungovanie stránky.
        </p>

        <div className="divide-y divide-[#eee]">
          <Toggle
            label="Nevyhnutné"
            description="Základné cookies potrebné pre fungovanie webovej stránky."
            checked={local.essential}
            disabled
            onChange={() => {}}
          />
          <Toggle
            label="Analytické"
            description="Pomáhajú nám pochopiť, ako návštevníci používajú našu stránku."
            checked={local.analytics}
            onChange={(v) => setLocal((p) => ({ ...p, analytics: v }))}
          />
          <Toggle
            label="Marketingové"
            description="Používajú sa na zobrazovanie relevantných reklám a obsahu."
            checked={local.marketing}
            onChange={(v) => setLocal((p) => ({ ...p, marketing: v }))}
          />
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => onSave(local)}
            className="h-11 flex-1 bg-[var(--color-brand)] text-[15px] font-medium text-white transition-colors hover:bg-[var(--color-brand-dark)]"
          >
            Uložiť nastavenia
          </button>
          <button
            onClick={() =>
              onSave({ essential: true, analytics: true, marketing: true })
            }
            className="h-11 flex-1 border border-[#ddd] bg-white text-[15px] font-medium text-[var(--color-brown)] transition-colors hover:bg-[#f5f5f5]"
          >
            Prijať všetky
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Main Banner ---- */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFS);

  useEffect(() => {
    const stored = getStoredPrefs();
    if (stored) {
      setPrefs(stored);
    } else {
      // Delay showing the banner slightly for a smoother page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom event from footer "Cookies" link
  useEffect(() => {
    const handler = () => {
      const stored = getStoredPrefs();
      if (stored) setPrefs(stored);
      setShowSettings(true);
    };
    window.addEventListener('open-cookie-settings', handler);
    return () => window.removeEventListener('open-cookie-settings', handler);
  }, []);

  const handleSave = useCallback((p: CookiePreferences) => {
    setPrefs(p);
    storePrefs(p);
    setShowSettings(false);
    setVisible(false);
  }, []);

  const handleAcceptAll = useCallback(() => {
    const all: CookiePreferences = { essential: true, analytics: true, marketing: true };
    setPrefs(all);
    storePrefs(all);
    setVisible(false);
  }, []);

  return (
    <>
      {showSettings && (
        <CookieSettingsModal
          prefs={prefs}
          onSave={handleSave}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[150] flex justify-center px-4 pb-5 transition-all duration-500 ease-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="w-full max-w-[680px] rounded-xl bg-white px-6 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
          <p className="mb-4 text-[14px] font-light leading-relaxed text-[#555]">
            Táto stránka používa cookies na zlepšenie vášho zážitku.{' '}
            <button
              onClick={() => setShowSettings(true)}
              className="font-medium text-[var(--color-brand)] underline underline-offset-2 transition-colors hover:text-[var(--color-brand-dark)]"
            >
              Nastavenia
            </button>
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleAcceptAll}
              className="h-10 bg-[var(--color-brand)] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-brand-dark)]"
            >
              Prijať všetky
            </button>
            <button
              onClick={() => handleSave(DEFAULT_PREFS)}
              className="h-10 border border-[#ddd] bg-white px-6 text-[14px] font-medium text-[var(--color-brown)] transition-colors hover:bg-[#f5f5f5]"
            >
              Iba nevyhnutné
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
