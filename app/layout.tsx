import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import React from 'react';
import '../styles/tailwind.css';

export const metadata: Metadata = {
  title: {
    default: '本棚',
    template: '%s | 本棚',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="catppuccin-mocha">
      <body>{children}</body>
    </html>
  );
}
