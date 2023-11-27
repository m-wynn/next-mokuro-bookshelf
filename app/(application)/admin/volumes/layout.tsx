export default function Step({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return <div className="flex flex-col max-w-4xl grow">{children}</div>;
}
