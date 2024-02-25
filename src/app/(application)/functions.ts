'use server';

import { ReadingStatus } from '@prisma/client';
import prisma from 'db';
import { ReadingSelectQuery } from 'lib/reading';

export const updateReadingStatus = async (id: number, status: ReadingStatus) => {
  'use server';

  return prisma.reading.update({
    where: {
      id,
    },
    data: {
      status,
    },
    select: ReadingSelectQuery,
  });
};

export const removeReading = async (id: number) => {
  'use server';

  return prisma.reading.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
    select: ReadingSelectQuery,
  });
};

export const setReadingVolume = async (id: number, volumeNum: number) => {
  'use server';

  return prisma.reading.update({
    where: {
      id,
    },
    data: {
      volumeNum,
      page: 0,
    },
    select: ReadingSelectQuery,
  });
};
