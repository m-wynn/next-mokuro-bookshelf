import { Prisma } from '@prisma/client';

// Everything that updates allReadings from the database should use this select
export const ReadingSelectQuery = {
  id: true,
  page: true,
  status: true,
  updatedAt: true,
  volume: {
    select: {
      number: true,
      id: true,
      seriesId: true,
      cover: true,
      _count: {
        select: { pages: true },
      },
      series: {
        select: {
          englishName: true,
          japaneseName: true,
          isNsfw: true,
          id: true,
        },
      },
    },
  },
} satisfies Prisma.ReadingSelect;

export type Reading = Prisma.ReadingGetPayload<{
  select: typeof ReadingSelectQuery;
}>;
