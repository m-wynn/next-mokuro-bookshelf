import { Role } from "@prisma/client";
import prisma from "db";
import { getSession } from "lib/session";
import React from "react";
import Preferences from "./Preferences";

export default async function UserSettings(req) {
  const session = await getSession("GET");
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.userId
    },
    select: {
      userSetting: {
        select: {
          useTwoPages: true,
        }
      }
    }
  });

  const updateUseTwoPages = async (useTwoPages: boolean) => {
    "use server";
    const settings = await prisma.userSetting.upsert({
      where: {
        userId: session.user.userId,
      },
      update: {
        useTwoPages
      },
      create: {
        userId: session.user.userId,
        useTwoPages
      },
    });
  };

  return (
    <Preferences user={user} updateUseTwoPages={updateUseTwoPages} />
  );
};
