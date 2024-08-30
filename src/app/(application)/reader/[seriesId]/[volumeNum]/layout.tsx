'use client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden fixed w-screen t-0"
      style={{
        height: 'calc(100vh - 4rem)',
      }}
    >
      {children}
    </div>
  );
}
