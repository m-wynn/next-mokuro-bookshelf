export default function UserSettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <div className="flex flex-col items-center w-screen max-h-screen">
      {children}
    </div>
  );
}
