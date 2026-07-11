import { MetadataRoute } from 'next';
import { getAllPostSlugs } from '@/lib/queries/posts';
import { getAllCategorySlugs } from '@/lib/queries/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://retrato.halonso.digital';

  // Base routes
  const routes = [
    '',
    '/archive',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Dynamic post pages sitemaps
    const posts = await getAllPostSlugs();
    const postRoutes = posts.map((post) => ({
      url: `${siteUrl}/post/${post.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Dynamic category pages sitemaps
    const categories = await getAllCategorySlugs();
    const categoryRoutes = categories.map((cat) => ({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...postRoutes, ...categoryRoutes];
  } catch (error) {
    console.error('Failed to generate sitemap routes:', error);
    return routes;
  }
}
