import prisma from 'db';
import { AllBooks } from './AllBooks';
import { Prisma } from '@prisma/client';

const seriesSelect = {
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
        select: {
          page: true,
        },
      },
      _count: {
        select: { pages: true },
      },
    },
  },
} satisfies Prisma.SeriesSelect;

export type SeriesPayload = Prisma.SeriesGetPayload<{
  select: typeof seriesSelect;
}>;

const AddNew = async () => {
  const series = await prisma.series.findMany({
    select: seriesSelect,
  });

  return (
    <div className="p-5 latte bg-crust text-text">
      <AllBooks series={series} />
    </div>
  );
};

export default AddNew;
