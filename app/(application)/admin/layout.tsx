import Sidebar from "./sidebar";
export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="flex justify-center m-4 drawer-content">{children}</div>
      <div className="drawer-side">
        <Sidebar />
      </div>
    </section>
  );
}
