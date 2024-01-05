import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-5 latte bg-crust text-text">{children}</div>;
}
