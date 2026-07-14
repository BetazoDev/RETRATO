import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { formatDate, stripHtml, truncate } from '@/lib/utils';

interface ArticleGridProps {
  posts: Post[];
  excerptLimit?: number;
}

export default function ArticleGrid({ posts, excerptLimit = 120 }: ArticleGridProps) {
  if (posts.length === 0) return null;

  const [post1, post2, post3, post4, post5] = posts;

  return (
    <section className="grid-sec">
      <div className="grid-layout">
        {/* Vertical Card 1 (col-4) */}
        {post1 && (
          <div className="grid-vertical-card">
            <Link href={`/post/${post1.slug}`} className="grid-card-link">
              {post1.featuredImage?.node && (
                <div className="grid-vertical-image-wrapper">
                  <Image
                    src={post1.featuredImage.node.sourceUrl}
                    alt={post1.featuredImage.node.altText || post1.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
              )}
              <div className="grid-card-content">
                <span className="grid-category-tag">
                  {post1.categories?.nodes?.[0]?.name || 'Article'}
                </span>
                <h3 className="grid-card-title">{post1.title}</h3>
                {post1.excerpt && (
                  <p className="grid-card-excerpt">
                    {truncate(stripHtml(post1.excerpt), excerptLimit)}
                  </p>
                )}
                <div className="grid-card-meta">
                  <span>{post1.author?.node?.name}</span>
                  <span className="grid-meta-dot" />
                  <span>{post1.postExtended?.readingTime || '5'} Min Read</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Editorial Text Card (col-4) */}
        {post2 && (
          <div className="grid-editorial-card">
            <span className="grid-category-tag">
              {post2.postExtended?.featuredLabel || 'Editorial Note'}
            </span>
            {post2.postExtended?.pullQuote ? (
              <h2 className="grid-editorial-quote">
                &ldquo;{post2.postExtended.pullQuote}&rdquo;
              </h2>
            ) : (
              <h2 className="grid-editorial-quote">
                &ldquo;{post2.title}&rdquo;
              </h2>
            )}
            <div className="grid-editorial-divider" />
            <h3 className="grid-editorial-title">{post2.title}</h3>
            {post2.excerpt && (
              <p className="grid-card-excerpt">
                {truncate(stripHtml(post2.excerpt), excerptLimit)}
              </p>
            )}
            <Link href={`/post/${post2.slug}`} className="grid-read-link">
              Read Essay →
            </Link>
          </div>
        )}

        {/* Vertical Card 3 (col-4) */}
        {post3 && (
          <div className="grid-vertical-card">
            <Link href={`/post/${post3.slug}`} className="grid-card-link">
              {post3.featuredImage?.node && (
                <div className="grid-vertical-image-wrapper">
                  <Image
                    src={post3.featuredImage.node.sourceUrl}
                    alt={post3.featuredImage.node.altText || post3.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
              )}
              <div className="grid-card-content">
                <span className="grid-category-tag">
                  {post3.categories?.nodes?.[0]?.name || 'Article'}
                </span>
                <h3 className="grid-card-title">{post3.title}</h3>
                {post3.excerpt && (
                  <p className="grid-card-excerpt">
                    {truncate(stripHtml(post3.excerpt), excerptLimit)}
                  </p>
                )}
                <div className="grid-card-meta">
                  <span>{post3.author?.node?.name}</span>
                  <span className="grid-meta-dot" />
                  <span>{post3.postExtended?.readingTime || '5'} Min Read</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Wide Feature Card (col-8) */}
        {post4 && (
          <div className="grid-feature-card">
            <Link href={`/post/${post4.slug}`} className="grid-feature-link">
              {post4.featuredImage?.node && (
                <div className="grid-feature-image-wrapper">
                  <Image
                    src={post4.featuredImage.node.sourceUrl}
                    alt={post4.featuredImage.node.altText || post4.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  {/* Gradient overlay */}
                  <div className="grid-feature-gradient" />
                </div>
              )}
              <div className="grid-feature-content">
                <span className="grid-feature-badge">
                  {post4.postExtended?.featuredLabel || 'Special Feature'}
                </span>
                <h3 className="grid-feature-title">{post4.title}</h3>
                {post4.excerpt && (
                  <p className="grid-feature-excerpt">
                    {truncate(stripHtml(post4.excerpt), excerptLimit)}
                  </p>
                )}
              </div>
            </Link>
          </div>
        )}

        {/* Small Text Card (col-4) */}
        {post5 && (
          <div className="grid-small-card">
            <span className="grid-category-tag">
              {post5.categories?.nodes?.[0]?.name || 'Article'}
            </span>
            <h3 className="grid-small-title">{post5.title}</h3>
            {post5.excerpt && (
              <p className="grid-small-excerpt">
                {truncate(stripHtml(post5.excerpt), excerptLimit)}
              </p>
            )}
            <Link href={`/post/${post5.slug}`} className="btn-secondary grid-open-button">
              Open Article
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
