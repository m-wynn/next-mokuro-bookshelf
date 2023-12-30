import Navbar from "./navbar";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "auth/lucia";
import GlobalDataProvider from "./GlobalContext";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authRequest = auth.handleRequest("GET", context);
  const session = (await authRequest.validate()) ?? null;
  if (!session) redirect("/login");
  return (
    <GlobalDataProvider>
      <header>
        <nav>
          <Navbar session={session} />
        </nav>
      </header>

      <main>{children}</main>
    </GlobalDataProvider>
  );
}
