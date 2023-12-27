"use client";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/tailwind.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="catppuccin-mocha">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
