'use server';
import { ReadingSelectQuery, Reading } from 'lib/reading';
import prisma from 'db';
import { getSession } from 'lib/session';
import { revalidatePath } from 'next/cache';

export const updateReadingProgress = async (volumeId: number, page: number) => {
  const session = await getSession('POST');
  const userId = session.user.userId;
  // If the page is less than four, maybe the user isn't actually reading
  // TODO: Maybe prompt them if they wanna start tracking.
  const reading = await prisma.reading.findUnique({
    where: {
      volumeUser: {
        userId: userId,
        volumeId: volumeId,
      },
      isActive: true,
    },
    select: ReadingSelectQuery,
  });

  return await updateReadingInDb(reading, volumeId, page, userId);
};

const updateReadingInDb = async (
  reading: Reading | null,
  volumeId: number,
  page: number,
  userId: string,
) => {
  if (!reading && page < 4) {
    return null;
  }

  let status = reading?.status ?? 'READING';
  if (reading && page === reading.volume._count.pages - 1) {
    status = 'READ';
  }

  return await prisma.reading.upsert({
    where: {
      volumeUser: {
        userId: userId,
        volumeId: volumeId,
      },
    },
    update: {
      page: page,
      status: status,
      isActive: true,
    },
    create: {
      userId: userId,
      volumeId: volumeId,
      page: page,
      status: status,
      isActive: true,
    },
    select: ReadingSelectQuery,
  });
};
