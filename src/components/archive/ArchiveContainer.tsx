'use client';

import { useState, useEffect } from 'react';
import type { Post, PageInfo, Category } from '@/lib/types';
import ArchiveHeader from './ArchiveHeader';
import FilterBar from './FilterBar';
import PostGrid from './PostGrid';
import PostListView from './PostListView';
import Pagination from './Pagination';

interface ArchiveContainerProps {
  initialPosts: Post[];
  initialPageInfo: PageInfo;
  categories: Category[];
  categorySlug?: string;
  categoryName?: string;
  categoryDescription?: string;
  tagSlug?: string;
  excerptLimit?: number;
}

export default function ArchiveContainer({
  initialPosts,
  initialPageInfo,
  categories,
  categorySlug = 'all',
  categoryName,
  categoryDescription,
  tagSlug,
  excerptLimit,
}: ArchiveContainerProps) {
  const [activeCategory, setActiveCategory] = useState(categorySlug);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorsStack, setCursorsStack] = useState<string[]>([]);

  // Local storage view settings persist
  useEffect(() => {
    const savedView = localStorage.getItem('retrato-archive-view');
    if (savedView === 'list' || savedView === 'grid') {
      setCurrentView(savedView);
    }
  }, []);

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view);
    localStorage.setItem('retrato-archive-view', view);
  };

  // Fetch posts on category or page change
  const fetchPage = async (catSlug: string, cursor?: string, pageNumber = 1, direction: 'next' | 'prev' | 'refresh' = 'refresh', currentTagSlug?: string) => {
    setIsLoading(true);
    try {
      const url = new URL('/api/posts', window.location.origin);
      url.searchParams.set('first', '12');
      if (catSlug !== 'all') {
        url.searchParams.set('category', catSlug);
      }
      if (currentTagSlug) {
        url.searchParams.set('tag', currentTagSlug);
      }
      if (cursor) {
        url.searchParams.set('after', cursor);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setPageInfo(data.pageInfo);
        setCurrentPage(pageNumber);

        // Update cursor stack for back/prev tracking
        if (direction === 'next' && pageInfo.endCursor) {
          setCursorsStack((prev) => [...prev, pageInfo.startCursor || '']);
        } else if (direction === 'prev') {
          setCursorsStack((prev) => prev.slice(0, -1));
        } else if (direction === 'refresh') {
          setCursorsStack([]);
        }
      }
    } catch (error) {
      console.error('Failed to load archive page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = async () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      setCursorsStack((prev) => [...prev, pageInfo.endCursor!]);
      await fetchPage(activeCategory, pageInfo.endCursor, currentPage + 1, 'next', tagSlug);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      const newStack = [...cursorsStack];
      newStack.pop();
      setCursorsStack(newStack);
      
      const prevCursor = newStack.length > 0 ? newStack[newStack.length - 1] : undefined;
      await fetchPage(activeCategory, prevCursor, currentPage - 1, 'prev', tagSlug);
    }
  };

  const handleCategoryChange = async (catSlug: string) => {
    setActiveCategory(catSlug);
    setCursorsStack([]);
    await fetchPage(catSlug, undefined, 1, 'refresh', tagSlug);
  };

  // Resolve display name and description for the header
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  const displayCategoryName = activeCategoryObj?.name || (activeCategory === tagSlug ? categoryName : (activeCategory === 'all' ? undefined : categoryName));
  const displayCategoryDesc = activeCategoryObj?.description || (activeCategory === tagSlug ? categoryDescription : (activeCategory === 'all' ? undefined : categoryDescription));

  return (
    <section className="arc-section">
      {/* Breadcrumbs */}
      <nav className="arc-breadcrumbs" aria-label="Breadcrumbs">
        <span>Home</span>
        <span>/</span>
        <span className="arc-breadcrumbs-active">Archive</span>
      </nav>

      {/* Header */}
      <ArchiveHeader
        categoryName={displayCategoryName}
        categoryDescription={displayCategoryDesc}
        totalCount={posts.length} 
      />

      {/* Filter and View Toggles */}
      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Loading Overlay */}
      <div style={{ position: 'relative', minHeight: '300px', opacity: isLoading ? 0.5 : 1, transition: 'opacity var(--transition-fast)' }}>
        {currentView === 'grid' ? (
          <PostGrid posts={posts} excerptLimit={excerptLimit} />
        ) : (
          <PostListView posts={posts} />
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        hasNextPage={pageInfo.hasNextPage}
        hasPrevPage={currentPage > 1}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        currentPage={currentPage}
        totalEntries={posts.length * currentPage + (pageInfo.hasNextPage ? 12 : 0)} // dynamic estimate
        shownCount={12}
      />
    </section>
  );
}
