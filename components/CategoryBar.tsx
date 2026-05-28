'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Dizajnové', slug: 'dizajnove' },
  { name: 'Moderné', slug: 'moderne-kvetinace' },
  { name: 'Klasické', slug: 'klasicke-kvetinace' },
  { name: 'Svietiace', slug: 'svietiace-kvetinace' },
  { name: 'Nábytok', slug: 'nabytok' },
  { name: 'Doplnky', slug: 'doplnky' },
];

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[5rem] z-40 w-full overflow-x-auto bg-[var(--color-brown)] no-scrollbar transition-[top] duration-300 ease-out md:top-[var(--kochlik-sticky-offset,7rem)]">
      <div className="site-container">
        <ul className="flex min-w-max items-center justify-center gap-3 whitespace-nowrap md:gap-20">
          {categories.map((category) => {
            const isActive =
              pathname === `/product-category/${category.slug}` ||
              pathname === `/produkt-kategoria/${category.slug}`;
            return (
              <li key={category.slug}>
                <Link
                  href={`/produkt-kategoria/${category.slug}`}
                  className={cn(
                    'text-[15px] font-black uppercase tracking-wide transition-colors md:text-[18px] px-3 py-3.5 block md:px-5',
                    isActive
                      ? 'bg-[var(--color-brand)] text-white'
                      : 'text-white bg-transparent hover:bg-[var(--color-brand)] hover:text-white'
                  )}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
