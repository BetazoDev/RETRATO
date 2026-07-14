'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { MenuItem, WPImage } from '@/lib/types';
import { wpUrlToPath } from '@/lib/utils';
import SearchOverlay from '../shared/SearchOverlay';
import SubscribePopup from '../shared/SubscribePopup';

interface HeaderProps {
  menuItems: MenuItem[];
  logo: WPImage | null;
  siteTitle: string;
  imageUrl?: string | null;
}

export default function Header({ menuItems, logo, siteTitle, imageUrl }: HeaderProps) {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isSubscribeOpen, setSubscribeOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('retrato-theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('retrato-theme', nextTheme);
  };

  const [brightness, setBrightness] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (!imageUrl) {
      setBrightness('light');
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const checkHeight = 100;
        canvas.width = img.width;
        canvas.height = Math.min(img.height, checkHeight);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        let r, g, b, avg;
        let colorSum = 0;

        for (let x = 0, len = data.length; x < len; x += 4) {
          r = data[x];
          g = data[x + 1];
          b = data[x + 2];

          avg = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
          );
          colorSum += avg;
        }

        const brightnessAvg = colorSum / (data.length / 4);
        if (brightnessAvg > 140) {
          setBrightness('light');
        } else {
          setBrightness('dark');
        }
      } catch (e) {
        console.warn('Could not analyze image brightness:', e);
        setBrightness('dark');
      }
    };
    img.onerror = () => {
      setBrightness('dark');
    };
  }, [imageUrl]);

  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setIsPastHero(true);
      return;
    }

    const handleScroll = () => {
      const heroEl = document.querySelector('.post-hero');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // If bottom of hero is above the sticky header's viewport threshold
        setIsPastHero(rect.bottom <= 72);
      } else {
        setIsPastHero(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [imageUrl]);

  const headerClass = (imageUrl && !isPastHero)
    ? `header header-overlay ${brightness === 'light' ? 'header-text-dark' : 'header-text-light'}`
    : 'header';

  const logoSrc = logo ? logo.sourceUrl : (mounted && theme === 'dark' ? '/logo-dark.png' : '/logo-light.png');
  const logoAlt = logo?.altText || siteTitle;

  return (
    <>
      <header className={headerClass}>
        <div className="header-inner">
          {/* Left: Logo + Nav */}
          <div className="header-left-group">
            <Link href="/" className="header-logo-area">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={170}
                height={56}
                className="header-logo-image"
                priority
              />
            </Link>

            <nav className="header-nav" aria-label="Primary navigation">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={wpUrlToPath(item.url || item.path)}
                  className="header-nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Search + Subscribe */}
          <div className="header-right-group">
            <button
              className="header-search-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </button>

            <button
              className="header-search-button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              className="btn-primary header-subscribe-button"
              onClick={() => setSubscribeOpen(true)}
            >
              Subscribe
            </button>

            <button
              className="header-mobile-menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`header-mobile-overlay ${isMobileOpen ? 'header-mobile-overlay-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div className={`header-mobile-drawer ${isMobileOpen ? 'header-mobile-drawer-open' : ''}`}>
        <button
          className="header-mobile-close-button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav aria-label="Mobile navigation">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={wpUrlToPath(item.url || item.path)}
              className="header-mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="btn-primary"
          onClick={() => {
            setMobileOpen(false);
            setSubscribeOpen(true);
          }}
          style={{ width: '100%', marginTop: 'auto' }}
        >
          Subscribe
        </button>
      </div>

      {/* Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      <SubscribePopup isOpen={isSubscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </>
  );
}
