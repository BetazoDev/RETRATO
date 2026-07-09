/**
 * Format a WordPress date string into a human-readable format.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date into a short format (e.g., "01/24").
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

/**
 * Calculate estimated reading time from HTML content.
 */
export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Truncate text to a maximum length, adding ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/**
 * Convert a WordPress absolute URL to a relative path for Next.js navigation.
 */
export function wpUrlToPath(url: string): string {
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
    if (url.startsWith(wpUrl)) {
      return url.replace(wpUrl, '') || '/';
    }
    const parsed = new URL(url);
    return parsed.pathname || '/';
  } catch {
    return url;
  }
}
