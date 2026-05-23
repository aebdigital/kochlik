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
    <div className="sticky top-24 z-40 w-full overflow-x-auto bg-[var(--color-brown)] no-scrollbar md:top-[132px]">
      <div className="site-container">
        <ul className="flex min-w-max items-center justify-between gap-12 whitespace-nowrap py-5">
          {categories.map((category) => {
            const isActive =
              pathname === `/product-category/${category.slug}` ||
              pathname === `/produkt-kategoria/${category.slug}`;
            return (
              <li key={category.slug}>
                <Link
                  href={`/product-category/${category.slug}`}
                  className={cn(
                    'text-[17px] font-extrabold uppercase tracking-wide transition-colors md:text-[21px]',
                    isActive
                      ? 'text-[var(--color-brand)]'
                      : 'text-white hover:text-[var(--color-brand)]'
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
