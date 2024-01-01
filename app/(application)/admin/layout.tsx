import prisma from 'db';
import Sidebar from './sidebar';
import { getSession } from 'lib/session';
import AdminContext from './AdminContext';
export default async function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getSession('GET');
  if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
    throw new Error('Unauthorized');
  }

  const series = await prisma.series.findMany({});

  return (
    <section className="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="flex justify-center m-4 drawer-content">
        <AdminContext dbSeries={series}>{children}</AdminContext>
      </div>
      <div className="drawer-side">
        <Sidebar />
      </div>
    </section>
  );
}
