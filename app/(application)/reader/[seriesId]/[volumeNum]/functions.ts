"use server";
import { ReadingSelectQuery } from "lib/reading";
import prisma from "db";
import { getSession } from "lib/session";
import { revalidatePath } from 'next/cache';

export const updateReadingProgress = async (volumeId: number, page: number) => {
  const session = await getSession("POST");
  const userId = session.user.userId;
  // If the page is less than four, maybe the user isn't actually reading
  // TODO: Maybe prompt them if they wanna start tracking.
  if (page < 4) {
    const reading = await prisma.reading.findUnique({
      where: {
        volumeUser: {
          userId: userId,
          volumeId: volumeId,
        },
        isActive: true,
        status: {
          // If the user has already read this volume, don't update the reading
          // If they're past page four, too bad I don't wanna write it tonight
          not: "READ",
        },
      },
      select: {
        id: true,
      },
    });
    if (reading) {
      return await updateReadingInDb(volumeId, page, userId);
    }
  } else {
    return await updateReadingInDb(volumeId, page, userId);
  }
  return null;
};

const updateReadingInDb = async (
  volumeId: number,
  page: number,
  userId: string,
) => {
  const reading = await prisma.reading.upsert({
    where: {
      volumeUser: {
        userId: userId,
        volumeId: volumeId,
      },
    },
    update: {
      page: page,
      status: "READING",
      isActive: true,
    },
    create: {
      userId: userId,
      volumeId: volumeId,
      page: page,
      status: "READING",
      isActive: true,
    },
    select: ReadingSelectQuery,
  });

  revalidatePath('/');
  revalidatePath('/allbooks');

  return reading;
};
