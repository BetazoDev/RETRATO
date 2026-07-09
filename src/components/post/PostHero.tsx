import type { Post } from '@/lib/types';

interface PostHeroProps {
  post: Post;
}

export default function PostHero({ post }: PostHeroProps) {
  const imageUrl =
    post.postExtended?.heroImage?.node?.sourceUrl ||
    post.featuredImage?.node?.sourceUrl ||
    '';
  const featuredLabel = post.postExtended?.featuredLabel || 'Visual Culture';

  return (
    <section className="post-hero">
      {imageUrl && (
        <div
          className="post-hero-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={post.featuredImage?.node?.altText || post.title}
        />
      )}
      <div className="post-hero-overlay" />
      <div className="post-hero-content">
        <span className="post-hero-badge">
          {featuredLabel}
        </span>
        <h1 className="post-hero-title">
          {post.title}
        </h1>
        {post.postExtended?.subtitle && (
          <p className="post-hero-subtitle">
            {post.postExtended.subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
