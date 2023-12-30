"use server";
import prisma from "db";
import { getSession } from "lib/session";

export const updateUseTwoPages = async (useTwoPages: boolean) => {
  const session = await getSession("POST");
  await prisma.userSetting.upsert({
    where: {
      userId: session.user.userId,
    },
    update: {
      useTwoPages,
    },
    create: {
      userId: session.user.userId,
      useTwoPages,
    },
  });
};
