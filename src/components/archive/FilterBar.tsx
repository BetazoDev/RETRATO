'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';

interface FilterBarProps {
  categories: Category[];
  activeCategory: string; // 'all' or category slug
  onCategoryChange: (slug: string) => void;
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  currentView,
  onViewChange,
}: FilterBarProps) {
  const [showAll, setShowAll] = useState(false);

  // Filter out Uncategorized category
  const filteredCategories = categories.filter(
    (cat) => cat.slug.toLowerCase() !== 'uncategorized' && cat.name.toLowerCase() !== 'uncategorized'
  );

  // Limit display to 4 unless showAll is toggled
  const displayedCategories = showAll ? filteredCategories : filteredCategories.slice(0, 4);

  return (
    <div className="arc-controls-bar">
      {/* Category Filter Chips */}
      <div className="arc-filter-chips">
        <button
          className={`arc-chip ${activeCategory === 'all' ? 'arc-chip-active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          ALL FORMATS
        </button>
        {displayedCategories.map((cat) => (
          <button
            key={cat.id}
            className={`arc-chip ${activeCategory === cat.slug ? 'arc-chip-active' : ''}`}
            onClick={() => onCategoryChange(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
        {filteredCategories.length > 4 && (
          <button
            className="arc-chip arc-chip-more"
            onClick={() => setShowAll(!showAll)}
            style={{ borderStyle: 'dashed', opacity: 0.8 }}
          >
            {showAll ? 'SEE LESS' : 'SEE MORE'}
          </button>
        )}
      </div>

      {/* Grid vs List View Toggle */}
      <div className="arc-view-toggles">
        <button
          className={`arc-toggle-btn ${currentView === 'list' ? 'arc-toggle-btn-active' : ''}`}
          onClick={() => onViewChange('list')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            reorder
          </span>
          List View
        </button>
        <button
          className={`arc-toggle-btn ${currentView === 'grid' ? 'arc-toggle-btn-active' : ''}`}
          onClick={() => onViewChange('grid')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            grid_view
          </span>
          Grid View
        </button>
      </div>
    </div>
  );
}
