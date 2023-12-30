export default function UserSettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <div className="flex justify-center m-4 drawer-content">
      <div className="flex flex-col max-w-4xl grow">{children}</div>
    </div>
  );
}