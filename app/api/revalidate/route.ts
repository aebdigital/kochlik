import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

function handleRevalidation(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Purge all fetch responses tagged with 'cms-catalog'
    revalidateTag('cms-catalog', { expire: 0 });
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error revalidating' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}
