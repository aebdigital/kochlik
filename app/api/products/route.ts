import { NextResponse } from 'next/server';
import { getCatalog } from '@/lib/data';

export async function GET() {
  try {
    const products = await getCatalog();
    
    // Map products to a lightweight structure to optimize search network payload size
    const searchData = products.map(product => ({
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '/legacy/logo.svg',
      price: product.price,
      brand: product.brand || 'KOCHLIK',
      category: product.categories[0] || '',
    }));

    return NextResponse.json(searchData);
  } catch (error) {
    console.error('Failed to fetch search catalog:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}
