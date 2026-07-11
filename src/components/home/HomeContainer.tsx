'use client';

import { useCustomizer } from '@/lib/hooks/useCustomizer';
import type { Category, Post, MenuItem, Tag } from '@/lib/types';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import HeroSection from './HeroSection';
import EditorialTicker from './EditorialTicker';
import CategorySection from './CategorySection';
import ArticleGrid from './ArticleGrid';

interface HomeContainerProps {
  initialSettings: any;
  menuItems: MenuItem[];
  categories: Category[];
  tags: Tag[];
  latestPosts: Post[];
  siteTitle: string;
  wpLogo?: { sourceUrl: string; altText?: string } | null;
}

export default function HomeContainer({
  initialSettings,
  menuItems,
  categories,
  tags,
  latestPosts,
  siteTitle,
  wpLogo,
}: HomeContainerProps) {
  // Listen to Customizer changes in real-time
  const liveSettings = useCustomizer(initialSettings);

  // Group latest posts by category and tag slug
  const postsByTaxonomy: Record<string, Post[]> = {};
  latestPosts.forEach((post) => {
    // Categories
    post.categories?.nodes?.forEach((cat) => {
      if (!postsByTaxonomy[cat.slug]) {
        postsByTaxonomy[cat.slug] = [];
      }
      if (!postsByTaxonomy[cat.slug].some((p) => p.id === post.id)) {
        postsByTaxonomy[cat.slug].push(post);
      }
    });
    // Tags
    post.tags?.nodes?.forEach((tag) => {
      if (!postsByTaxonomy[tag.slug]) {
        postsByTaxonomy[tag.slug] = [];
      }
      if (!postsByTaxonomy[tag.slug].some((p) => p.id === post.id)) {
        postsByTaxonomy[tag.slug].push(post);
      }
    });
  });

  // Resolve Logo object for Header
  const customLogoObj = liveSettings.custom_logo
    ? { sourceUrl: liveSettings.custom_logo, altText: siteTitle }
    : (wpLogo ? { sourceUrl: wpLogo.sourceUrl, altText: wpLogo.altText || '' } : null);

  // Parse layout settings order JSON (holds order, active state, and nested featured post choice)
  const orderString = liveSettings.retrato_homepage_categories_order || '';
  interface SavedSection {
    slug: string;
    type: 'category' | 'tag';
    active: boolean;
    show_featured: boolean;
    featured_post: string;
  }
  let parsedSections: SavedSection[] = [];

  if (orderString) {
    try {
      const parsed = JSON.parse(orderString);
      if (Array.isArray(parsed)) {
        parsedSections = parsed;
      }
    } catch (e) {
      // Fallback to legacy comma-separated list of active category slugs
      const slugs = orderString
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
      parsedSections = slugs.map((slug) => ({
        slug,
        type: 'category',
        active: true,
        show_featured: false,
        featured_post: '',
      }));
    }
  } else {
    // Fallback: If no setting is present, show all categories (legacy default)
    parsedSections = categories.map((c) => ({
      slug: c.slug,
      type: 'category',
      active: true,
      show_featured: false,
      featured_post: '',
    }));
  }

  // Filter only active sections
  const activeSections = parsedSections.filter((s) => s.active);

  // Live excerpt limit
  const excerptLimit = Number(liveSettings.retrato_card_excerpt_limit ?? 120);

  // Homepage Cover Hero Post (first featured post, or fallback to first latest post)
  const heroPost = latestPosts.find((p) => p.postExtended?.isFeatured) || latestPosts[0];
  const tickerTitles = latestPosts.slice(0, 8).map((p) => p.title);

  return (
    <>
      <Header
        menuItems={menuItems}
        logo={customLogoObj}
        siteTitle={siteTitle}
      />

      <main>
        {heroPost && <HeroSection post={heroPost} />}
        <EditorialTicker titles={tickerTitles} />

        {/* Main Asymmetric Masonry Grid */}
        <ArticleGrid posts={latestPosts.slice(0, 5)} excerptLimit={excerptLimit} />

        {/* Dynamic Customizer-configured Category & Tag Sections */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {activeSections.map((section) => {
            let name = '';
            let id = section.slug;
            const isTag = section.type === 'tag';

            if (isTag) {
              const tagObj = tags.find((t) => t.slug === section.slug);
              if (!tagObj) return null;
              name = tagObj.name;
              id = tagObj.id;
            } else {
              const catObj = categories.find((c) => c.slug === section.slug);
              if (!catObj) return null;
              name = catObj.name;
              id = catObj.id;
            }

            const sectionPosts = postsByTaxonomy[section.slug] || [];
            if (sectionPosts.length === 0) return null;

            // Global limit per category/tag block
            const globalLimit = Number(liveSettings.retrato_global_posts_limit ?? 6);

            return (
              <CategorySection
                key={id}
                categoryName={name}
                categorySlug={section.slug}
                isTag={isTag}
                posts={sectionPosts}
                limit={globalLimit}
                showFeatured={section.show_featured}
                featuredPostSlug={section.featured_post || undefined}
                excerptLimit={excerptLimit}
              />
            );
          })}
        </div>
      </main>

      <Footer 
        siteTitle={siteTitle} 
        instagramUrl={liveSettings.retrato_instagram_url}
        twitterUrl={liveSettings.retrato_twitter_url}
        telegramUrl={liveSettings.retrato_telegram_url}
      />
    </>
  );
}
