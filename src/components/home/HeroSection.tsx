import Link from 'next/link';
import type { Post } from '@/lib/types';

interface HeroSectionProps {
  post: Post;
}

export default function HeroSection({ post }: HeroSectionProps) {
  const imageUrl =
    post.postExtended?.heroImage?.node?.sourceUrl ||
    post.featuredImage?.node?.sourceUrl;
  const category = post.categories?.nodes?.[0];
  const label = post.postExtended?.featuredLabel;

  return (
    <section className="hero-sec">
      <div className="hero-container">
        {/* Large Editorial Image */}
        {imageUrl && (
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${imageUrl})` }}
            role="img"
            aria-label={
              post.postExtended?.heroImage?.node?.altText ||
              post.featuredImage?.node?.altText ||
              post.title
            }
          />
        )}

        {/* Overlapping Headline */}
        <div className="hero-headline-area">
          <Link href={`/post/${post.slug}`}>
            <h1 className="hero-headline">{post.title}</h1>
          </Link>
        </div>

        {/* Metadata Labels */}
        <div className="hero-meta-area">
          {label && <div className="hero-badge">{label}</div>}
          {category && (
            <div className="hero-category-label">{category.name}</div>
          )}
        </div>
      </div>
    </section>
  );
}
