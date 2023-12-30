import Sidebar from "./sidebar";
import { getSession } from "lib/session";
export default async function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getSession("GET");
  if (session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
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
