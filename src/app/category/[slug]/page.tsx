import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArchiveContainer from '@/components/archive/ArchiveContainer';
import { getPrimaryMenu, getSiteSettings } from '@/lib/queries/menus';
import { getArchivePosts } from '@/lib/queries/posts';
import { getAllCategories, getAllCategorySlugs } from '@/lib/queries/categories';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

// Dynamic Metadata
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categories = await getAllCategories();
  const activeCat = categories.find((c) => c.slug === resolvedParams.slug);

  if (!activeCat) return {};

  return {
    title: `${activeCat.name} — RETRATO`,
    description: activeCat.description || `Browse all visual culture articles in category ${activeCat.name}`,
  };
}

// Pre-build Category slugs
export async function generateStaticParams() {
  try {
    const categories = await getAllCategorySlugs();
    return categories.map((cat) => ({
      slug: cat.slug,
    }));
  } catch (error) {
    console.error('Error generating category static params:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const [menuItems, siteSettings, categories, initialData] = await Promise.all([
    getPrimaryMenu(),
    getSiteSettings(),
    getAllCategories(),
    getArchivePosts(12, undefined, resolvedParams.slug),
  ]);

  const activeCategoryInfo = categories.find((c) => c.slug === resolvedParams.slug);

  if (!activeCategoryInfo) {
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
          categorySlug={resolvedParams.slug}
          categoryName={activeCategoryInfo.name}
          categoryDescription={activeCategoryInfo.description}
        />
      </main>

      <Footer siteTitle={siteSettings.generalSettings.title || 'RETRATO'} />
    </>
  );
}
