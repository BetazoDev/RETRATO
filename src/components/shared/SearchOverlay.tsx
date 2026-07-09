'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Debounced search
  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (searchQuery.trim().length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery.trim())}`
          );
          const data = await res.json();
          setResults(data.posts || []);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <button
        className="search-close"
        onClick={onClose}
        aria-label="Close search"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="material-symbols-outlined search-icon">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoComplete="off"
          />
        </div>

        {isLoading && (
          <p className="search-status">Searching...</p>
        )}

        {!isLoading && query.length >= 2 && results.length === 0 && (
          <p className="search-status">No articles found for &ldquo;{query}&rdquo;</p>
        )}

        {results.length > 0 && (
          <ul className="search-results">
            {results.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/post/${post.slug}`}
                  className="search-result-item"
                  onClick={onClose}
                >
                  <span className="search-result-category">
                    {post.categories?.nodes?.[0]?.name || 'Article'}
                  </span>
                  <span className="search-result-title">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
