'use client';

import { useState, FormEvent } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setFeedback('Vyplňte prosím všetky povinné polia.');
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedback(data.message || 'Správa bola úspešne odoslaná!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setFeedback(data.error || 'Nepodarilo sa odoslať správu.');
      }
    } catch {
      setStatus('error');
      setFeedback('Nastala chyba pri komunikácii so serverom.');
    }
  };

  return (
    <div>
      <h2 className="mb-8 text-[28px] font-extrabold text-[var(--color-brown)]">Napíšte nám.</h2>

      {status === 'success' && (
        <div className="mb-6 flex items-center gap-3 rounded-md bg-green-50 px-5 py-4 text-[16px] text-green-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 flex items-center gap-3 rounded-md bg-red-50 px-5 py-4 text-[16px] text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-[18px] font-light text-[#777]">
          Vaše meno (povinné)
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={status === 'loading'}
            className="mt-2 h-12 w-full border border-[#ddd] bg-white px-4 text-[16px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--color-brand)] disabled:opacity-50"
          />
        </label>
        <label className="block text-[18px] font-light text-[#777]">
          Váš email (povinné)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="mt-2 h-12 w-full border border-[#ddd] bg-white px-4 text-[16px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--color-brand)] disabled:opacity-50"
          />
        </label>
        <label className="block text-[18px] font-light text-[#777]">
          Vaša správa
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            disabled={status === 'loading'}
            className="mt-2 w-full border border-[#ddd] bg-white p-4 text-[16px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--color-brand)] disabled:opacity-50"
          />
        </label>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex h-12 items-center gap-2 bg-[var(--color-brand)] px-8 text-[18px] font-light text-white transition-colors hover:bg-[var(--color-brand-dark)] disabled:opacity-60"
        >
          {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === 'loading' ? 'Odosiela sa...' : 'Odoslať'}
        </button>
      </form>
    </div>
  );
}
