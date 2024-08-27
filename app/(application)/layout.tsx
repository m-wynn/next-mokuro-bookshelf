import * as context from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from 'auth/lucia';
import prisma from 'db';
import { ReadingSelectQuery } from 'lib/reading';
<<<<<<< Updated upstream
import { UserSettingSelectQuery } from 'lib/userSetting';
=======
>>>>>>> Stashed changes
import GlobalDataProvider from './GlobalContext';
import Navbar from './navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authRequest = auth.handleRequest('GET', context);
  const session = (await authRequest.validate()) ?? null;
  if (!session) redirect('/login');

  const readings = await prisma.reading.findMany({
    where: {
      userId: session.user.userId,
      isActive: true,
    },
    select: ReadingSelectQuery,
  });

  const userSettings = await prisma.userSetting.findUnique({
    where: {
      userId: session.user.userId,
    },
    select: UserSettingSelectQuery,
  });

  return (
    <GlobalDataProvider readings={readings} initialUserSettings={userSettings}>
      <header>
        <nav>
          <Navbar session={session} />
        </nav>
      </header>

      <main>{children}</main>
    </GlobalDataProvider>
  );
}
