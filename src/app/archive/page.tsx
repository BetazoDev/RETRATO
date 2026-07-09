import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArchiveContainer from '@/components/archive/ArchiveContainer';
import { getPrimaryMenu, getSiteSettings } from '@/lib/queries/menus';
import { getArchivePosts } from '@/lib/queries/posts';
import { getAllCategories } from '@/lib/queries/categories';

export const metadata: Metadata = {
  title: 'Archive — RETRATO',
  description: 'Explore the full database of visual essays, categories, and analog photography database.',
};

export const revalidate = 120;

export default async function ArchivePage() {
  const [menuItems, siteSettings, categories, initialData] = await Promise.all([
    getPrimaryMenu(),
    getSiteSettings(),
    getAllCategories(),
    getArchivePosts(12),
  ]);

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
        />
      </main>

      <Footer siteTitle={siteSettings.generalSettings.title || 'RETRATO'} />
    </>
  );
}
