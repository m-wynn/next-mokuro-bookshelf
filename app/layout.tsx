"use client";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/tailwind.css";
import NextAuthProvider from "@/NextAuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body data-theme="catppuccin-mocha">
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
