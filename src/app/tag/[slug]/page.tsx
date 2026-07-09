import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArchiveContainer from '@/components/archive/ArchiveContainer';
import { getPrimaryMenu, getSiteSettings } from '@/lib/queries/menus';
import { getArchivePosts } from '@/lib/queries/posts';
import { getAllCategories } from '@/lib/queries/categories';
import { getAllTags, getAllTagSlugs } from '@/lib/queries/tags';

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

// Dynamic Metadata
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tags = await getAllTags();
  const activeTag = tags.find((t) => t.slug === resolvedParams.slug);

  if (!activeTag) return {};

  return {
    title: `${activeTag.name} — RETRATO`,
    description: activeTag.description || `Browse all visual culture articles tagged with ${activeTag.name}`,
  };
}

// Pre-build Tag slugs
export async function generateStaticParams() {
  try {
    const tags = await getAllTagSlugs();
    return tags.map((tag) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    console.error('Error generating tag static params:', error);
    return [];
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const [menuItems, siteSettings, categories, tags, initialData] = await Promise.all([
    getPrimaryMenu(),
    getSiteSettings(),
    getAllCategories(),
    getAllTags(),
    getArchivePosts(12, undefined, undefined, resolvedParams.slug),
  ]);

  const activeTagInfo = tags.find((t) => t.slug === resolvedParams.slug);

  if (!activeTagInfo) {
    notFound();
  }

  return (
    <>
      <Header
        menuItems={menuItems}
        logo={siteSettings.customLogo}
        siteTitle={siteSettings.generalSettings.title || 'RETRATO'}
      />

      <main>
        <ArchiveContainer
          initialPosts={initialData.posts.nodes}
          initialPageInfo={initialData.posts.pageInfo}
          categories={categories}
          categorySlug="all" // Tag page shows posts from all categories by default
          tagSlug={resolvedParams.slug}
          categoryName={`Tag: ${activeTagInfo.name}`}
          categoryDescription={activeTagInfo.description || `Articles tagged with ${activeTagInfo.name}`}
        />
      </main>

      <Footer siteTitle={siteSettings.generalSettings.title || 'RETRATO'} />
    </>
  );
}
