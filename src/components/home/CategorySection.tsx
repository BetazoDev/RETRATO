import Link from 'next/link';
import type { Post } from '@/lib/types';
import { stripHtml, truncate } from '@/lib/utils';
import ArticleCard from '../shared/ArticleCard';

interface CategorySectionProps {
  categoryName: string;
  categorySlug: string;
  isTag?: boolean;
  posts: Post[];
  limit?: number;
  showFeatured?: boolean;
  featuredPostSlug?: string;
  excerptLimit?: number;
}

export default function CategorySection({
  categoryName,
  categorySlug,
  isTag = false,
  posts,
  limit = 6,
  showFeatured = false,
  featuredPostSlug,
  excerptLimit = 120,
}: CategorySectionProps) {
  if (posts.length === 0) return null;

  // Resolve featured post if enabled
  let featuredPost: Post | null = null;
  let remainingPosts = [...posts];

  if (showFeatured) {
    if (featuredPostSlug) {
      const foundIdx = posts.findIndex((p) => p.slug === featuredPostSlug);
      if (foundIdx > -1) {
        featuredPost = posts[foundIdx];
        remainingPosts.splice(foundIdx, 1);
      }
    }
    // Fallback to first post if no specific featured slug was resolved
    if (!featuredPost && posts.length > 0) {
      featuredPost = posts[0];
      remainingPosts.splice(0, 1);
    }
  }

  // Slice list posts to matching limit (global limit per section)
  const listPosts = remainingPosts.slice(0, showFeatured ? Math.max(1, limit - 1) : limit);
  const archivePath = isTag ? `/tag/${categorySlug}` : `/category/${categorySlug}`;

  return (
    <section className="cat-sec">
      {/* Category header title and line separator */}
      <div className="cat-header">
        <h3 className="cat-title">
          <Link href={archivePath}>
            {categoryName}
          </Link>
        </h3>
        <div className="cat-divider" />
      </div>

      {showFeatured && featuredPost ? (
        <div className="cat-featured-stack">
          {/* Top: 100% width Featured Card */}
          <Link href={`/post/${featuredPost.slug}`} className="cat-featured-card">
            {featuredPost.featuredImage?.node?.sourceUrl && (
              <img
                src={featuredPost.featuredImage.node.sourceUrl}
                alt={featuredPost.featuredImage.node.altText || featuredPost.title}
                className="cat-featured-image"
              />
            )}
            <div className="cat-featured-overlay" />
            <span className="cat-featured-badge">
              {featuredPost.postExtended?.featuredLabel || 'Special Feature'}
            </span>
            <div className="cat-featured-content" style={{ maxWidth: '800px' }}>
              <h4 className="cat-featured-title">{featuredPost.title}</h4>
              {featuredPost.excerpt && (
                <p className="cat-featured-excerpt">
                  {truncate(stripHtml(featuredPost.excerpt), excerptLimit)}
                </p>
              )}
            </div>
          </Link>

          {/* Bottom: 3-column Grid for the rest of the articles */}
          {listPosts.length > 0 && (
            <div className="cat-standard-grid">
              {listPosts.map((post) => (
                <ArticleCard key={post.id} post={post} showBadge={false} excerptLimit={excerptLimit} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Standard 3-column Grid Layout */
        <div className="cat-standard-grid">
          {listPosts.map((post) => (
            <ArticleCard key={post.id} post={post} showBadge={false} excerptLimit={excerptLimit} />
          ))}
        </div>
      )}
    </section>
  );
}
