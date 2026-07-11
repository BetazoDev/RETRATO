import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleCard from '@/components/shared/ArticleCard';
import { getPrimaryMenu, getSiteSettings } from '@/lib/queries/menus';
import { searchPosts } from '@/lib/queries/posts';
import { getExcerptLimit } from '@/lib/utils';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  return {
    title: query ? `Search results for "${query}" — RETRATO` : 'Search — RETRATO',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  
  const menuItems = await getPrimaryMenu();
  const siteSettings = await getSiteSettings();
  const posts = query ? await searchPosts(query) : [];
  const excerptLimit = getExcerptLimit(siteSettings.homepageSettings);

  return (
    <>
      <Header
        menuItems={menuItems}
        logo={siteSettings.customLogo}
        siteTitle={siteSettings.generalSettings.title || 'RETRATO'}
      />

      <main className="arc-section">
        <nav className="arc-breadcrumbs" aria-label="Breadcrumbs">
          <span>Home</span>
          <span>/</span>
          <span className="arc-breadcrumbs-active">Search</span>
        </nav>

        <div className="mb-12">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight font-serif mb-2">
            Search Database
          </h2>
          <p className="opacity-60 text-sm">
            {query 
              ? `Found ${posts.length} entries for "${query}"`
              : 'Type a query in the search bar above to look up visual culture articles.'}
          </p>
        </div>

        {query && posts.length === 0 && (
          <div className="py-20 text-center opacity-40 font-bold uppercase tracking-widest text-xs">
            No entries found in our archive matching your search terms.
          </div>
        )}

        {posts.length > 0 && (
          <div className="arc-post-grid">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} excerptLimit={excerptLimit} />
            ))}
          </div>
        )}
      </main>

      <Footer siteTitle={siteSettings.generalSettings.title || 'RETRATO'} />
    </>
  );
}
