import Image from 'next/image';
import type { Post } from '@/lib/types';

interface PostHeroProps {
  post: Post;
}

export default function PostHero({ post }: PostHeroProps) {
  const imageUrl =
    post.postExtended?.heroImage?.node?.sourceUrl ||
    post.featuredImage?.node?.sourceUrl ||
    '';
  const imageAlt =
    post.postExtended?.heroImage?.node?.altText ||
    post.featuredImage?.node?.altText ||
    post.title;
  const featuredLabel = post.postExtended?.featuredLabel || 'Visual Culture';

  return (
    <section className="post-hero">
      {imageUrl && (
        <div className="post-hero-image-wrapper">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
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
