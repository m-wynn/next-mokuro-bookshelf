import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/tailwind.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: '本棚',
    template: '%s',
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
