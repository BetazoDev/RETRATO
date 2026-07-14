import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';

interface HeroSectionProps {
  post: Post;
}

export default function HeroSection({ post }: HeroSectionProps) {
  const imageUrl =
    post.postExtended?.heroImage?.node?.sourceUrl ||
    post.featuredImage?.node?.sourceUrl;
  const imageAlt =
    post.postExtended?.heroImage?.node?.altText ||
    post.featuredImage?.node?.altText ||
    post.title;
  const category = post.categories?.nodes?.[0];
  const label = post.postExtended?.featuredLabel;

  return (
    <section className="hero-sec">
      <div className="hero-container">
        {/* Large Editorial Image — LCP element, loaded with priority */}
        {imageUrl && (
          <div className="hero-image-wrapper">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="hero-image-img"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
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
