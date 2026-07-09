import type { Metadata } from 'next';
import { getPrimaryMenu, getSiteSettings } from '@/lib/queries/menus';
import { getHomepagePosts, getCategories } from '@/lib/queries/posts';
import { getAllTags } from '@/lib/queries/tags';
import HomeContainer from '@/components/home/HomeContainer';

export const metadata: Metadata = {
  title: 'RETRATO — Visual Culture & Photography Magazine',
  description:
    'An independent digital publication exploring the intersection of film photography, urban culture, and minimalist visual theory.',
};

export const revalidate = 60;

export default async function HomePage() {
  const [menuItems, siteSettings, postsData, categories, tags] = await Promise.all([
    getPrimaryMenu(),
    getSiteSettings(),
    getHomepagePosts(),
    getCategories(),
    getAllTags(),
  ]);

  const { latestPosts } = postsData;

  // Parse customizer settings JSON
  let initialSettings = {};
  if (siteSettings.homepageSettings) {
    try {
      initialSettings = JSON.parse(siteSettings.homepageSettings);
    } catch (e) {
      console.error('Failed to parse customizer settings:', e);
    }
  }

  return (
    <HomeContainer
      initialSettings={initialSettings}
      menuItems={menuItems}
      categories={categories}
      tags={tags}
      latestPosts={latestPosts.nodes}
      siteTitle={siteSettings.generalSettings.title || 'RETRATO'}
      wpLogo={siteSettings.customLogo || null}
    />
  );
}
