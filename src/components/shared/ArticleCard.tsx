import Link from 'next/link';
import type { Post } from '@/lib/types';
import { stripHtml, truncate } from '@/lib/utils';

interface ArticleCardProps {
  post: Post;
  showBadge?: boolean;
  isFeaturedBanner?: boolean;
  excerptLimit?: number;
}

export default function ArticleCard({ post, showBadge = true, isFeaturedBanner = false, excerptLimit = 120 }: ArticleCardProps) {
  const categoryName = post.categories?.nodes?.[0]?.name || 'Article';
  const imageUrl = post.featuredImage?.node?.sourceUrl || '';
  const altText = post.featuredImage?.node?.altText || post.title;
  const authorName = post.author?.node?.name || 'Staff';
  const readingTime = post.postExtended?.readingTime || 5;

  return (
    <article className={`w-full ${isFeaturedBanner ? 'arc-featured-banner' : ''}`}>
      <Link href={`/post/${post.slug}`} className={`grid-card-link ${isFeaturedBanner ? 'banner-link' : ''}`}>
        <div style={{ position: 'relative' }}>
          {showBadge && post.postExtended?.featuredLabel && (
            <span className="art-featured-badge">{post.postExtended.featuredLabel}</span>
          )}
          {imageUrl ? (
            <div
              className={`grid-vertical-image ${isFeaturedBanner ? 'banner-image' : ''}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
              role="img"
              aria-label={altText}
            />
          ) : (
            <div className={`grid-vertical-image bg-zinc-200 dark:bg-zinc-800 ${isFeaturedBanner ? 'banner-image' : ''}`} />
          )}
        </div>
        
        <div className="grid-card-content">
          <span className="grid-category-tag">
            {categoryName}
          </span>
          <h3 className="grid-card-title">{post.title}</h3>
          {post.excerpt && (
            <p className="grid-card-excerpt">
              {truncate(stripHtml(post.excerpt), excerptLimit)}
            </p>
          )}
          <div className="grid-card-meta">
            <span>{authorName}</span>
            <span className="grid-meta-dot" />
            <span>{readingTime} Min Read</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
