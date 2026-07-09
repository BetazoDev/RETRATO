import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReadingProgress from '@/components/post/ReadingProgress';
import PostHero from '@/components/post/PostHero';
import PostContent from '@/components/post/PostContent';
import TechnicalSheet from '@/components/post/TechnicalSheet';
import RelatedPosts from '@/components/post/RelatedPosts';
import { getPrimaryMenu, getSiteSettings } from '@/lib/queries/menus';
import { getPost, getRelatedPosts, getAllPostSlugs } from '@/lib/queries/posts';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// Dynamic Metadata Generation for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const post = await getPost(resolvedParams.slug);
    if (!post) return {};

    return {
      title: post.seo?.title || `${post.title} — RETRATO`,
      description: post.seo?.metaDesc || post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160),
      openGraph: {
        title: post.seo?.opengraphTitle || post.title,
        description: post.seo?.opengraphDescription || post.excerpt?.replace(/<[^>]*>/g, ''),
        images: post.seo?.opengraphImage?.sourceUrl 
          ? [{ url: post.seo.opengraphImage.sourceUrl }] 
          : post.featuredImage?.node?.sourceUrl 
            ? [{ url: post.featuredImage.node.sourceUrl }] 
            : [],
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: post.author?.node?.name ? [post.author.node.name] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo?.twitterTitle || post.title,
        description: post.seo?.twitterDescription,
      },
      alternates: {
        canonical: post.seo?.canonical || `/post/${post.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {};
  }
}

// SSG: Pre-render all active posts
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const [post, menuItems, siteSettings] = await Promise.all([
    getPost(resolvedParams.slug),
    getPrimaryMenu(),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  // Get related posts in the same primary category
  const primaryCategory = post.categories?.nodes?.[0]?.slug;
  const relatedPosts = primaryCategory 
    ? await getRelatedPosts(primaryCategory, post.id) 
    : [];

  const heroImageUrl = post.postExtended?.heroImage?.node?.sourceUrl || post.featuredImage?.node?.sourceUrl;

  return (
    <>
      <Header
        menuItems={menuItems}
        logo={siteSettings.customLogo}
        siteTitle={siteSettings.generalSettings.title || 'RETRATO'}
        imageUrl={heroImageUrl}
      />
      <main>
        <PostHero post={post} />
        <PostContent post={post} />
        <TechnicalSheet sheet={post.postExtended?.technicalSheet} />
        <RelatedPosts posts={relatedPosts} />
      </main>

      <Footer siteTitle={siteSettings.generalSettings.title || 'RETRATO'} />
    </>
  );
}
