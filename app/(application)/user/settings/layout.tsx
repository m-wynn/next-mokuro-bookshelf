import React from 'react';

export default function UserSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center w-screen max-h-screen">
      {children}
    </div>
  );
}
