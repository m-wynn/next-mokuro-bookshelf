import Navbar from "./navbar";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "auth/lucia";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authRequest = auth.handleRequest("GET", context);
  const session = (await authRequest.validate()) ?? null;
  if (!session) redirect("/login");
  return (
    <>
      <header>
        <nav>
          <Navbar />
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
