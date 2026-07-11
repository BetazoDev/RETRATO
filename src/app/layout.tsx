import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/shared/CustomCursor';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
