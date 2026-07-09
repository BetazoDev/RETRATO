import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/queries/posts';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const posts = await searchPosts(query.trim());
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ posts: [], error: 'Search failed' }, { status: 500 });
  }
}
