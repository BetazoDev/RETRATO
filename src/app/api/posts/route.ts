import { NextRequest, NextResponse } from 'next/server';
import { getArchivePosts } from '@/lib/queries/posts';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categorySlug = searchParams.get('category') || undefined;
  const tagSlug = searchParams.get('tag') || undefined;
  const after = searchParams.get('after') || undefined;
  const first = parseInt(searchParams.get('first') || '12', 10);

  // Normalize 'all' category to undefined
  const cat = categorySlug === 'all' ? undefined : categorySlug;

  try {
    const data = await getArchivePosts(first, after, cat, tagSlug);
    return NextResponse.json({
      posts: data.posts.nodes,
      pageInfo: data.posts.pageInfo,
    });
  } catch (error) {
    console.error('Posts API proxy error:', error);
    return NextResponse.json(
      { posts: [], pageInfo: null, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
