import Link from 'next/link';
import Image from 'next/image';

const socialLinks = [
  {
    href: 'https://www.facebook.com/kochlikba',
    label: 'Facebook',
    icon: '/legacy/social/facebook.svg',
  },
  {
    href: '#',
    label: 'Instagram',
    icon: '/legacy/social/instagram.png',
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[var(--color-brown)] py-16 text-white/80">
      <div className="site-container grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <div className="w-full max-w-[260px] min-w-0">
          <h3 className="mb-6 text-[22px] font-extrabold text-white">Kontakt</h3>
          <div className="space-y-3 text-[16px] font-light leading-relaxed">
            <p>Ulica 29. augusta 28</p>
            <p>811 09 Bratislava</p>
            <p>
              <a href="tel:+421905587986" className="hover:text-[var(--color-brand)] transition-colors">+421 905 587 986</a>
            </p>
            <p>
              <a href="mailto:info@kochlik.eu" className="hover:text-[var(--color-brand)] transition-colors">info@kochlik.eu</a>
            </p>
          </div>
          <div className="flex items-center gap-4 pt-6">
            {socialLinks.map(item => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[8px] bg-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
 
        <div className="w-full max-w-[260px] min-w-0">
          <h3 className="mb-6 text-[22px] font-extrabold text-white">Otváracie hodiny</h3>
          <div className="space-y-3 text-[16px] font-light leading-relaxed">
            <p>Na objednávku nakoľko pracujeme aj v teréne</p>
            <p>Stretnutie v predajni si prosím dohodnite telefonicky.</p>
          </div>
        </div>
 
        <div className="w-full max-w-[260px] min-w-0">
          <h3 className="mb-6 text-[22px] font-extrabold text-white">Kategórie</h3>
          <ul className="space-y-3 text-[16px] font-light">
            {[
              ['Nábytok', '/product-category/nabytok'],
              ['Moderné kvetináče', '/product-category/moderne-kvetinace'],
              ['Dizajnové kvetináče', '/product-category/dizajnove'],
              ['Klasické kvetináče', '/product-category/klasicke-kvetinace'],
              ['Svietiace kvetináče', '/product-category/svietiace-kvetinace'],
              ['Doplnky', '/product-category/doplnky'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-[var(--color-brand)] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
 
        <div className="w-full max-w-[260px] min-w-0">
          <h3 className="mb-6 text-[22px] font-extrabold text-white">Právne</h3>
          <ul className="space-y-3 text-[16px] font-light">
            {[
              ['Ochrana osobných údajov', '/ochrana-osobnych-udajov'],
              ['Všeobecné obchodné podmienky', '/obchodne-podmienky'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-[var(--color-brand)] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-container mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[14px] font-light text-white/50 md:flex-row md:items-center md:justify-between">
        <p>© 2026 KOCHLIK s.r.o.</p>
        <p>
          Tvorba webu —{' '}
          <a
            href="https://aebdigital.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-brand)]"
          >
            AEB Digital
          </a>
        </p>
      </div>
    </footer>
  );
}
