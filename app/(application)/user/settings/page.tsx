import prisma from "db";
import { getSession } from "lib/session";
import { UserSettingSelectQuery } from "lib/userSetting";
import React from "react";
import Preferences from "./Preferences";

export default async function UserSettings() {
  const session = await getSession("GET");
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.userId,
    },
    select: {
      userSetting: {
        select: UserSettingSelectQuery,
      },
    },
  });

  if (!user) {
    return <div>Not found</div>;
  }
  return <Preferences user={user} />;
}
