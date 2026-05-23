'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/data';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const sortOptions: Array<{ label: string; value: SortKey }> = [
  { label: 'Predvolené', value: 'default' },
  { label: 'Cena: od najnižšej', value: 'price-asc' },
  { label: 'Cena: od najvyššej', value: 'price-desc' },
  { label: 'Názov A-Z', value: 'name-asc' },
];

function priceValue(price: string): number {
  // Catalog format: "€1,234.56" or ranges like "€407.00 – €1,002.00".
  // Comma is a thousands separator; period is the decimal. Use the low end of ranges.
  const firstNumber = price.split(/[–-]/)[0] ?? '';
  const normalized = firstNumber.replace(/[^\d.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && normalized.length > 0 ? parsed : NaN;
}

function comparePrice(a: Product, b: Product, direction: 'asc' | 'desc'): number {
  const va = priceValue(a.price);
  const vb = priceValue(b.price);
  const aMissing = Number.isNaN(va);
  const bMissing = Number.isNaN(vb);
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  return direction === 'asc' ? va - vb : vb - va;
}

export default function ProductListing({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>('default');
  const [brand, setBrand] = useState('all');

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        products
          .flatMap(product => (product.brands.length > 0 ? product.brands : [product.brand]))
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, 'sk'));
  }, [products]);

  const visibleProducts = useMemo(() => {
    const filtered = brand === 'all'
      ? [...products]
      : products.filter(product => product.brands.includes(brand) || product.brand === brand);

    if (sort === 'price-asc') {
      return filtered.sort((a, b) => comparePrice(a, b, 'asc'));
    }

    if (sort === 'price-desc') {
      return filtered.sort((a, b) => comparePrice(a, b, 'desc'));
    }

    if (sort === 'name-asc') {
      return filtered.sort((a, b) => a.name.localeCompare(b.name, 'sk'));
    }

    return filtered;
  }, [brand, products, sort]);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-[24px] font-light text-[#999]">
          V tejto kategórii sa nenašli žiadne produkty.
        </h2>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
      <aside className="hidden pt-8 lg:block">
        <h2 className="mb-6 text-[24px] font-extrabold text-[var(--color-brown)]">Zoradiť podľa</h2>
        <ul className="space-y-4 text-[17px] font-light text-[#777]">
          {sortOptions.map(option => (
            <li key={option.value}>
              <button
                className={sort === option.value ? 'text-[var(--color-brand)]' : 'transition-colors hover:text-[var(--color-brand)]'}
                onClick={() => setSort(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>

        {brands.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-[24px] font-extrabold text-[var(--color-brown)]">Značka</h2>
            <ul className="space-y-4 text-[17px] font-light text-[#777]">
              <li>
                <button
                  className={brand === 'all' ? 'text-[var(--color-brand)]' : 'transition-colors hover:text-[var(--color-brand)]'}
                  onClick={() => setBrand('all')}
                >
                  Všetky značky
                </button>
              </li>
              {brands.map(item => (
                <li key={item}>
                  <button
                    className={brand === item ? 'text-[var(--color-brand)]' : 'transition-colors hover:text-[var(--color-brand)]'}
                    onClick={() => setBrand(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <div>
        <div className="mb-8 grid gap-4 border-b border-[#eee] pb-4 lg:hidden">
          <span className="text-[16px] font-light text-[#777]">{visibleProducts.length} produktov</span>
          <select
            value={sort}
            className="h-12 w-full border border-[#e5e5e5] bg-white px-4 text-[16px] text-[#777] outline-none"
            onChange={event => setSort(event.target.value as SortKey)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {brands.length > 0 && (
            <select
              value={brand}
              className="h-12 w-full border border-[#e5e5e5] bg-white px-4 text-[16px] text-[#777] outline-none"
              onChange={event => setBrand(event.target.value)}
            >
              <option value="all">Všetky značky</option>
              {brands.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {visibleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-[24px] font-light text-[#999]">
              Pre zvolenú značku sa nenašli žiadne produkty.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
