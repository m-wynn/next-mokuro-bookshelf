// Everything that updates allReadings from the database should use this select
export const readingSelect = {
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
          name: true,
          id: true,
        },
      },
    },
  },
};
