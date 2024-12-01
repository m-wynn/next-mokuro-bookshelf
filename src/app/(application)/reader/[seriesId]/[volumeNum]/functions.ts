'use server';

import { ReadingSelectQuery, Reading } from 'lib/reading';
import prisma from 'db';
import { getSession } from 'lib/session';
import { revalidatePath } from 'next/cache';

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

  return prisma.reading.upsert({
    where: {
      volumeUser: {
        userId,
        volumeId,
      },
    },
    update: {
      page,
      status,
      isActive: true,
    },
    create: {
      userId,
      volumeId,
      page,
      status,
      isActive: true,
    },
    select: ReadingSelectQuery,
  });
};

const updateEpubReadingInDb = async (
  reading: Reading | null,
  volumeId: number,
  epubPage: string,
  userId: string,
) => {
  let status = reading?.status ?? 'READING';
  if (reading && epubPage === 'end') {
    status = 'READ';
  }

  return prisma.reading.upsert({
    where: {
      volumeUser: {
        userId,
        volumeId,
      },
    },
    update: {
      epubPage,
      status,
      isActive: true,
    },
    create: {
      userId,
      volumeId,
      epubPage,
      status,
      isActive: true,
    },
    select: ReadingSelectQuery,
  });
};

export const updateReadingProgress = async (volumeId: number, page: number | string) => {
  const session = await getSession('POST');
  const { userId } = session.user;
  // If the page is less than four, maybe the user isn't actually reading
  // TODO: Maybe prompt them if they wanna start tracking.
  const reading = await prisma.reading.findUnique({
    where: {
      volumeUser: {
        userId,
        volumeId,
      },
      isActive: true,
    },
    select: ReadingSelectQuery,
  });

  const updatedReading = await updateReadingInDb(reading, volumeId, page as number, userId);
  revalidatePath(`/reader/${updatedReading!.volume.seriesId}/${volumeId}/`);
  return updatedReading;
};

export const updateEpubReadingProgress = async (volumeId: number, epubPage: string) => {
  const session = await getSession('POST');
  const { userId } = session.user;
  const reading = await prisma.reading.findUnique({
    where: {
      volumeUser: {
        userId,
        volumeId,
      },
      isActive: true,
    },
    select: ReadingSelectQuery,
  });

  const updatedReading = await updateEpubReadingInDb(reading, volumeId, epubPage, userId);
  revalidatePath(`/reader/${updatedReading!.volume.seriesId}/${volumeId}/`);
  return updatedReading;
};
