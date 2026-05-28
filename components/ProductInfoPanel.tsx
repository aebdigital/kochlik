'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/data';
import { Minus, Plus } from 'lucide-react';
import { useProject } from './ProjectContext';


interface ProductInfoPanelProps {
  product: Product;
}

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [selectedDimension, setSelectedDimension] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addItem, setIsOpen } = useProject();

  // Handle dimensions
  const hasPriceVariations = product.variations && product.variations.length > 0;
  const dimensions = product.dimensions || [];
  const hasDimensions = dimensions.length > 0;

  // Get current price based on selection
  let currentPrice = product.price;
  if (hasPriceVariations) {
    const targetDim = selectedDimension || dimensions[0];
    if (targetDim) {
      const matchedVar = product.variations.find(
        v => v.attributes.rozmer === targetDim || v.attributes.size === targetDim
      );
      if (matchedVar) {
        currentPrice = matchedVar.price;
      }
    }
  }

  // Handle colors
  const hasColors = product.colors && product.colors.length > 0;
  const isLightingProduct = product.categories.includes("Svietiace kvetináče") || 
    product.colors.some(c => /light|led|rgb|cable|battery|rechargeable/i.test(c.name));

  const handleAddToProject = () => {
    const selectedColorObj = product.colors?.find(c => c.name === selectedColor) || null;
    const itemImage = selectedColorObj?.image || product.images?.[0] || '';

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: itemImage,
      color: selectedColorObj,
      dimension: selectedDimension || null,
      quantity: quantity,
      price: currentPrice,
      url: product.url,
    });

    setIsOpen(true);
  };

  return (
    <div>
      {/* Price display */}
      <div className="mb-8 text-[28px] font-extrabold text-[var(--color-brand)] md:text-[34px]">
        {hasPriceVariations && !selectedDimension ? `od ${currentPrice}` : currentPrice}
      </div>

      {/* Dynamic Dimension Picker */}
      {hasDimensions && dimensions.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-[#999]">Rozmer</h3>
          <div className="flex flex-wrap gap-3">
            {dimensions.map(dim => (
              <button
                key={dim}
                type="button"
                onClick={() => setSelectedDimension(dim)}
                className={`border px-5 py-3 text-[15px] font-light transition-all cursor-pointer ${
                  selectedDimension === dim
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                    : 'border-[#d9d9d9] bg-white text-[#666] hover:border-[#999]'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Color Swatches */}
      {hasColors && (
        <div className="mb-10">
          <h3 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-[#999]">
            {isLightingProduct ? 'Dostupné varianty' : 'Dostupné farby'} {selectedColor && <span className="normal-case font-light text-[#555] ml-2">({selectedColor})</span>}
          </h3>
          <div className="flex flex-wrap gap-4">
            {product.colors.map(color => {
              const isSelected = selectedColor === color.name;
              const hasColorCircle = !!color.hex || !!color.image;

              if (hasColorCircle) {
                return (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative h-16 w-16 overflow-hidden rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                      isSelected 
                        ? 'border-[var(--color-brand)] scale-110 shadow-md ring-2 ring-[var(--color-brand)]/20' 
                        : 'border-[#d9d9d9] hover:border-[#666]'
                    }`}
                  >
                    {color.image ? (
                      <Image 
                        src={color.image} 
                        alt={color.name} 
                        width={64}
                        height={64}
                        className={`h-full w-full rounded-full object-cover transition-transform ${
                          color.image.includes('whitec2') ? 'scale-[1.4]' : ''
                        }`} 
                      />
                    ) : (
                      <span 
                        className="h-full w-full rounded-full border border-black/10" 
                        style={{ backgroundColor: color.hex }} 
                      />
                    )}
                  </button>
                );
              }

              // Text fallback for Serralunga or other text-only colors
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`border px-4 py-2 text-[14px] font-light transition-all rounded cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-normal'
                      : 'border-[#d9d9d9] bg-white text-[#666] hover:border-[#999]'
                  }`}
                >
                  {color.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Purchase Form Drawer */}
      <div className="mb-10 flex flex-col sm:flex-row gap-4">
        {/* Quantity selector */}
        <div className="flex items-center border border-[#d9d9d9] h-14 bg-white w-full sm:w-auto shrink-0 justify-between">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-12 h-full flex items-center justify-center text-[#555] hover:bg-gray-50 transition-colors cursor-pointer border-r border-[#d9d9d9]"
            aria-label="Menej"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-[16px] font-light text-[#333] select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            className="w-12 h-full flex items-center justify-center text-[#555] hover:bg-gray-50 transition-colors cursor-pointer border-l border-[#d9d9d9]"
            aria-label="Viac"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to project button */}
        <button
          type="button"
          onClick={handleAddToProject}
          className="flex-grow inline-flex h-14 items-center justify-center bg-[var(--color-brand)] px-8 text-[16px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[var(--color-brand-dark)] cursor-pointer"
        >
          Pridať do projektu
        </button>
      </div>
    </div>
  );
}
