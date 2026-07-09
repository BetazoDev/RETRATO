import type { Post } from '@/lib/types';
import ArticleCard from '../shared/ArticleCard';

interface PostGridProps {
  posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center opacity-50 font-bold tracking-widest uppercase text-xs">
        No entries found in this archive collection.
      </div>
    );
  }

  const featuredPost = posts.find((p) => p.postExtended?.isFeatured);
  const remainingPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  return (
    <div>
      {featuredPost && (
        <div className="arc-featured-banner">
          <ArticleCard post={featuredPost} isFeaturedBanner />
        </div>
      )}
      <div className="arc-post-grid">
        {remainingPosts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
