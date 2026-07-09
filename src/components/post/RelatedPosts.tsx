import Link from 'next/link';
import type { Post } from '@/lib/types';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  // We display the first related post prominently as "Up Next"
  const nextPost = posts[0];
  const readingTime = nextPost.postExtended?.readingTime || 5;

  return (
    <div className="related-sec">
      <div className="related-container">
        <h4 className="related-label">
          Up Next
        </h4>
        <Link href={`/post/${nextPost.slug}`} className="related-link">
          <h2 className="related-title">
            {nextPost.title}
          </h2>
          <p className="related-meta">
            Read Article — {readingTime} min
          </p>
        </Link>
      </div>
    </div>
  );
}
