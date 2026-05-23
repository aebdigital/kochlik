import Link from 'next/link';
import Image from 'next/image';

const socialLinks = [
  {
    href: 'https://www.facebook.com/kochlikba',
    label: 'Facebook',
    icon: '/legacy/social/facebook.svg',
  },
  {
    href: 'https://www.linkedin.com/in/anita-kochlik-924b4b6a/',
    label: 'LinkedIn',
    icon: '/legacy/social/linkedin.svg',
  },
  {
    href: '#',
    label: 'Instagram',
    icon: '/legacy/social/instagram.png',
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#eceaea] py-16 text-[#777]">
      <div className="site-container grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-6 text-[22px] font-extrabold text-[var(--color-brown)]">Kontakt</h3>
          <div className="space-y-3 text-[16px] font-light leading-relaxed">
            <p>Ulica 29. augusta 28</p>
            <p>Bratislava 841 09</p>
            <p>
              <a href="tel:+421905587986" className="hover:text-[var(--color-brand)]">+421 905 587 986</a>
            </p>
            <p>
              <a href="mailto:info@kochlik.eu" className="hover:text-[var(--color-brand)]">info@kochlik.eu</a>
            </p>
          </div>
          <div className="flex items-center gap-4 pt-6">
            {socialLinks.map(item => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[11px] shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-[22px] font-extrabold text-[var(--color-brown)]">Otváracie hodiny</h3>
          <div className="space-y-3 text-[16px] font-light leading-relaxed">
            <p>Na objednávku nakoľko pracujeme aj v teréne</p>
            <p>Stretnutie v predajni si prosím dohodnite telefonicky.</p>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-[22px] font-extrabold text-[var(--color-brown)]">Kategórie</h3>
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
                <Link href={href} className="hover:text-[var(--color-brand)]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-[22px] font-extrabold text-[var(--color-brown)]">Právne</h3>
          <ul className="space-y-3 text-[16px] font-light">
            {[
              ['Ochrana osobných údajov', '/ochrana-osobnych-udajov'],
              ['Všeobecné obchodné podmienky', '/obchodne-podmienky'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-[var(--color-brand)]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-container mt-14 border-t border-[#d8d6d6] pt-6 text-[14px] font-light text-[#777]">
        <p>© 2026 KOCHLIK s.r.o.</p>
      </div>
    </footer>
  );
}
