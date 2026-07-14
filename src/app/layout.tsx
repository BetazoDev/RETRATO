import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/shared/CustomCursor';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '700', '900'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'RETRATO — Visual Culture & Photography Magazine',
    template: '%s — RETRATO',
  },
  description:
    'An independent digital publication exploring the intersection of film photography, urban culture, and minimalist visual theory.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://retrato.halonso.digital'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'RETRATO',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
