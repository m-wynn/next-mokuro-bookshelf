'use server';

import { ReadingSelectQuery, Reading } from 'lib/reading';
import prisma from 'db';
import { getSession } from 'lib/session';

const updateReadingInDb = async (
  reading: Reading | null,
  volumeNum: number,
  seriesId: number,
  page: number,
  userId: string,
) => {
  if (!reading && page < 4) {
    return null;
  }

  const status = reading?.status ?? 'READING';
  const newVolumeNum = (reading && page === reading.volume._count.pages - 1)
    ? volumeNum + 1 : volumeNum;

  return prisma.reading.upsert({
    where: {
      seriesUser: {
        userId,
        seriesId,
      },
    },
    update: {
      page,
      status,
      isActive: true,
    },
    create: {
      userId,
      seriesId,
      volumeNum: newVolumeNum,
      page,
      status,
      isActive: true,
    },
    select: ReadingSelectQuery,
  });
};

export const updateReadingProgress = async (volumeNum: number, seriesId: number, page: number) => {
  const session = await getSession('POST');
  const { userId } = session.user;
  // If the page is less than four, maybe the user isn't actually reading
  // TODO: Maybe prompt them if they wanna start tracking.
  const reading = await prisma.reading.findUnique({
    where: {
      seriesUser: {
        userId,
        seriesId,
      },
      isActive: true,
    },
    select: ReadingSelectQuery,
  });

  return updateReadingInDb(reading, volumeNum, seriesId, page, userId);
};
