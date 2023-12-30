import Navbar from "./navbar";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "auth/lucia";
import GlobalDataProvider from "./GlobalContext";
import prisma from "db";
import { readingSelect } from "lib/reading";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authRequest = auth.handleRequest("GET", context);
  const session = (await authRequest.validate()) ?? null;
  if (!session) redirect("/login");

  const readings = await prisma.reading.findMany({
    where: {
      userId: session.userId,
      isActive: true,
    },
    select: readingSelect,
  });
  return (
    <GlobalDataProvider readings={readings}>
      <header>
        <nav>
          <Navbar session={session} />
        </nav>
      </header>

      <main>{children}</main>
    </GlobalDataProvider>
  );
}
