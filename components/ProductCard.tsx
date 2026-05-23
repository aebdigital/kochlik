import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/data';

type ProductCardProduct = Pick<Product, 'slug' | 'name' | 'price' | 'images'>;
 
export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const mainImage = product.images[0] || '/legacy/pot1.jpg';
  const hoverImage = product.images[1];

  return (
    <Link
      href={`/produkt/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, (min-width: 640px) 50vw, 100vw"
          className={
            hoverImage
              ? 'object-cover transition-opacity duration-500 group-hover:opacity-0'
              : 'object-cover transition duration-500 group-hover:scale-[1.03]'
          }
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 pt-4">
        <h3 className="text-[18px] font-extrabold leading-tight text-[#8a8a8a] transition-colors group-hover:text-[var(--color-brand-dark)]">
          {product.name}
        </h3>
        <Heart className="mt-0.5 h-5 w-5 text-[#9a9a9a]" strokeWidth={1.8} />
        <p className="col-span-2 text-[16px] font-light text-[#777]">
          {product.price}
        </p>
      </div>
    </Link>
  );
}
