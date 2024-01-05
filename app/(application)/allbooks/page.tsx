import prisma from 'db';
import { Prisma } from '@prisma/client';
import { getSession } from 'lib/session';
import { AllBooks } from './AllBooks';

const seriesSelect = (userId: string) => ({
  japaneseName: true,
  englishName: true,
  id: true,
  volumes: {
    select: {
      id: true,
      number: true,
      cover: true,
      createdAt: true,
      readings: {
        where: {
          userId,
        },
        select: {
          page: true,
        },
      },
      _count: {
        select: { pages: true },
      },
    },
  },
}) satisfies Prisma.SeriesSelect;

export type SeriesPayload = Prisma.SeriesGetPayload<{
  select: ReturnType<typeof seriesSelect>;
}>;

const AddNew = async () => {
  const session = await getSession('GET');
  const series = await prisma.series.findMany({
    select: seriesSelect(session.user.userId),
  });

  return (
    <div className="p-5 latte bg-crust text-text">
      <AllBooks series={series} />
    </div>
  );
};

export default AddNew;
