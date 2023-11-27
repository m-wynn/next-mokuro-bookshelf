import Navbar from "./navbar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>

      {children}
    </div>
  );
}
