import './globals.css';
import type { ReactNode } from 'react';
import { Figtree } from 'next/font/google';

const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'Midpoint — Video Studio',
  icons: { icon: '/midpoint-mark.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={figtree.className}>
      <body>{children}</body>
    </html>
  );
}
