'use client';

import { useState, useEffect } from 'react';

export interface CustomizerSettings {
  custom_logo?: string;
  retrato_homepage_categories_order?: string;
  retrato_instagram_url?: string;
  retrato_twitter_url?: string;
  retrato_telegram_url?: string;
  retrato_card_excerpt_limit?: number;
  [key: string]: any;
}

export function useCustomizer(initialSettings: CustomizerSettings) {
  const [settings, setSettings] = useState<CustomizerSettings>(initialSettings);

  useEffect(() => {
    // Only listen to messages if we are in the Customizer preview (iframe)
    const handleMessage = (event: MessageEvent) => {
      // Security check (optional: verify origin match if needed)
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'wp-customizer-init') {
        console.log('[Customizer Init]', data.values);
        setSettings((prev) => ({ ...prev, ...data.values }));
      } else if (data.type === 'wp-customizer-value') {
        console.log('[Customizer Update]', data.id, data.value);
        setSettings((prev) => ({
          ...prev,
          [data.id]: data.value,
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Request initial values from parent customizer on load
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'iframe-loaded' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return settings;
}
