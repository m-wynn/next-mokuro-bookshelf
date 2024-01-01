import Navbar from "./navbar";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "auth/lucia";
import GlobalDataProvider from "./GlobalContext";
import prisma from "db";
import { ReadingSelectQuery } from "lib/reading";
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
      userId: session.user.userId,
      isActive: true,
    },
    select: ReadingSelectQuery,
  });

  const userPref = await prisma.userSetting.findUnique({
    where: {
      userId: session.user.userId,
    },
    select: {
      useJapaneseTitle: true,
    },
  });
  return (
    <GlobalDataProvider
      readings={readings}
      useJapaneseTitle={userPref?.useJapaneseTitle ?? false}
    >
      <header>
        <nav>
          <Navbar session={session} />
        </nav>
      </header>

      <main>{children}</main>
    </GlobalDataProvider>
  );
}
