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

const dimensionGroupOptions = ['Do 50 cm', '51-100 cm', '101-150 cm', 'Nad 150 cm'];

// Color family config: label -> display color for the circle swatch
const colorFamilySwatches: Record<string, string> = {
  'Biela': '#ffffff',
  'Čierna': '#222222',
  'Hnedá': '#8B5E3C',
  'Červená': '#D32F2F',
  'Zelená': '#4CAF50',
  'Modrá': '#1976D2',
  'Žltá': '#FBC02D',
  'Oranžová': '#F57C00',
  'Ružová': '#E91E8C',
  'Sivá': '#9E9E9E',
  'Béžová': '#D4C5A9',
};

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
  const [colorFamily, setColorFamily] = useState('all');
  const [dimensionGroup, setDimensionGroup] = useState('all');

  // Compute the possible price range from products
  const priceRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const p of products) {
      const v = priceValue(p.price);
      if (!Number.isNaN(v)) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    return {
      min: min === Infinity ? 0 : Math.floor(min),
      max: max === -Infinity ? 1000 : Math.ceil(max),
    };
  }, [products]);

  // Price range state
  const [priceRangeVal, setPriceRangeVal] = useState<[number, number] | null>(null);

  // Sync state if products list changes (e.g. user changes category)
  const [prevProducts, setPrevProducts] = useState(products);
  if (prevProducts !== products) {
    setPrevProducts(products);
    setPriceRangeVal(null);
  }

  const minVal = priceRangeVal ? priceRangeVal[0] : priceRange.min;
  const maxVal = priceRangeVal ? priceRangeVal[1] : priceRange.max;

  const rangeDiff = priceRange.max - priceRange.min;
  const leftPercent = rangeDiff > 0 ? ((minVal - priceRange.min) / rangeDiff) * 100 : 0;
  const rightPercent = rangeDiff > 0 ? 100 - ((maxVal - priceRange.min) / rangeDiff) * 100 : 0;

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        products
          .flatMap(product => (product.brands.length > 0 ? product.brands : [product.brand]))
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, 'sk'));
  }, [products]);

  const availableColorFamilies = useMemo(() => {
    const families = new Set<string>();
    for (const p of products) {
      for (const f of p.colorFamilies) families.add(f);
    }
    // Return in the order defined in colorFamilySwatches
    return Object.keys(colorFamilySwatches).filter(f => families.has(f));
  }, [products]);

  const availableDimensionGroups = useMemo(() => {
    const groups = new Set<string>();
    for (const p of products) {
      for (const group of p.dimensionGroups) groups.add(group);
    }
    return dimensionGroupOptions.filter(group => groups.has(group));
  }, [products]);

  const visibleProducts = useMemo(() => {
    let filtered = brand === 'all'
      ? [...products]
      : products.filter(product => product.brands.includes(brand) || product.brand === brand);

    // Apply color family filter
    if (colorFamily !== 'all') {
      filtered = filtered.filter(product => product.colorFamilies.includes(colorFamily));
    }

    // Apply dimension group filter
    if (dimensionGroup !== 'all') {
      filtered = filtered.filter(product => product.dimensionGroups.includes(dimensionGroup));
    }

    // Apply price filter
    filtered = filtered.filter(product => {
      const v = priceValue(product.price);
      if (Number.isNaN(v)) return true; // keep "Cena na vyžiadanie" products
      return v >= minVal && v <= maxVal;
    });

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
  }, [brand, colorFamily, dimensionGroup, products, sort, minVal, maxVal]);

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
        {/* Price Range Filter (Desktop) */}
        {priceRange.max > priceRange.min && (
          <div className="mb-12 border-b border-[#eee] pb-10">
            <h2 className="mb-6 text-[24px] font-extrabold text-[var(--color-brown)]">Cena</h2>
            
            <div className="range-slider-container my-8">
              <div 
                className="range-slider-track"
                style={{
                  left: `${leftPercent}%`,
                  right: `${rightPercent}%`
                }}
              />
              <input 
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={minVal}
                onChange={e => {
                  const val = Math.min(Number(e.target.value), maxVal - 1);
                  setPriceRangeVal([val, maxVal]);
                }}
                className="range-slider-input"
              />
              <input 
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={maxVal}
                onChange={e => {
                  const val = Math.max(Number(e.target.value), minVal + 1);
                  setPriceRangeVal([minVal, val]);
                }}
                className="range-slider-input"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 text-[15px] font-light text-[#777]">
              <div className="flex items-center gap-2">
                <span>Od</span>
                <span className="font-semibold text-[var(--color-brown)]">{minVal} €</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Do</span>
                <span className="font-semibold text-[var(--color-brown)]">{maxVal} €</span>
              </div>
            </div>
          </div>
        )}

        {/* Color Family Filter (Desktop) */}
        {availableColorFamilies.length > 0 && (
          <div className="mb-12 border-b border-[#eee] pb-10">
            <h2 className="mb-6 text-[24px] font-extrabold text-[var(--color-brown)]">Farba</h2>
            <div className="flex flex-wrap gap-3">
              <button
                className={`h-9 px-4 border text-[14px] font-light transition-all rounded-full cursor-pointer ${
                  colorFamily === 'all'
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-normal'
                    : 'border-[#d9d9d9] text-[#777] hover:border-[#999]'
                }`}
                onClick={() => setColorFamily('all')}
              >
                Všetky
              </button>
              {availableColorFamilies.map(family => (
                <button
                  key={family}
                  title={family}
                  onClick={() => setColorFamily(family)}
                  className={`flex items-center gap-2 h-9 px-3 border text-[13px] font-light transition-all rounded-full cursor-pointer ${
                    colorFamily === family
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 font-normal'
                      : 'border-[#d9d9d9] text-[#777] hover:border-[#999]'
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: colorFamilySwatches[family] }}
                  />
                  {family}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dimension Filter (Desktop) */}
        {availableDimensionGroups.length > 0 && (
          <div className="mb-12 border-b border-[#eee] pb-10">
            <h2 className="mb-6 text-[24px] font-extrabold text-[var(--color-brown)]">Rozmer</h2>
            <div className="flex flex-wrap gap-3">
              <button
                className={`h-9 px-4 border text-[14px] font-light transition-all rounded-full cursor-pointer ${
                  dimensionGroup === 'all'
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-normal'
                    : 'border-[#d9d9d9] text-[#777] hover:border-[#999]'
                }`}
                onClick={() => setDimensionGroup('all')}
              >
                Všetky
              </button>
              {availableDimensionGroups.map(group => (
                <button
                  key={group}
                  onClick={() => setDimensionGroup(group)}
                  className={`h-9 px-4 border text-[14px] font-light transition-all rounded-full cursor-pointer ${
                    dimensionGroup === group
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-normal'
                      : 'border-[#d9d9d9] text-[#777] hover:border-[#999]'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brand Filter (Desktop) */}
        {brands.length > 0 && (
          <div>
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
        {/* Desktop sorting header */}
        <div className="mb-8 hidden items-center justify-between border-b border-[#eee] pb-5 lg:flex">
          <span className="text-[16px] font-light text-[#777]">
            Nájdených {visibleProducts.length} produktov
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-light text-[#777]">Zoradiť podľa:</span>
            <select
              value={sort}
              className="h-11 border border-[#d9d9d9] bg-white px-4 text-[15px] font-light text-[#333] outline-none transition-colors focus:border-[var(--color-brand)] cursor-pointer min-w-[200px]"
              onChange={event => setSort(event.target.value as SortKey)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile controls */}
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

          {/* Color Family Filter (Mobile) */}
          {availableColorFamilies.length > 0 && (
            <select
              value={colorFamily}
              className="h-12 w-full border border-[#e5e5e5] bg-white px-4 text-[16px] text-[#777] outline-none"
              onChange={event => setColorFamily(event.target.value)}
            >
              <option value="all">Všetky farby</option>
              {availableColorFamilies.map(family => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
          )}

          {/* Dimension Filter (Mobile) */}
          {availableDimensionGroups.length > 0 && (
            <select
              value={dimensionGroup}
              className="h-12 w-full border border-[#e5e5e5] bg-white px-4 text-[16px] text-[#777] outline-none"
              onChange={event => setDimensionGroup(event.target.value)}
            >
              <option value="all">Všetky rozmery</option>
              {availableDimensionGroups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          )}

          {/* Price Range Filter (Mobile) */}
          {priceRange.max > priceRange.min && (
            <div className="mt-4 border-t border-[#eee] pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-bold text-[var(--color-brown)]">Cena:</span>
                <span className="text-[14px] font-semibold text-[var(--color-brand)]">{minVal} € – {maxVal} €</span>
              </div>
              <div className="range-slider-container my-4">
                <div 
                  className="range-slider-track"
                  style={{
                    left: `${leftPercent}%`,
                    right: `${rightPercent}%`
                  }}
                />
                <input 
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={minVal}
                  onChange={e => {
                    const val = Math.min(Number(e.target.value), maxVal - 1);
                    setPriceRangeVal([val, maxVal]);
                  }}
                  className="range-slider-input"
                />
                <input 
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={maxVal}
                  onChange={e => {
                    const val = Math.max(Number(e.target.value), minVal + 1);
                    setPriceRangeVal([minVal, val]);
                  }}
                  className="range-slider-input"
                />
              </div>
            </div>
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
              Pre zvolené filtre sa nenašli žiadne produkty.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
