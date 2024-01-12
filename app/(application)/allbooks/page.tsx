import prisma from 'db';
import { Prisma } from '@prisma/client';
import { getSession } from 'lib/session';
import Link from 'next/link';
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
    orderBy: {
      number: 'asc',
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
      {series.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl">No Series Found</h1>
          {session.user?.role === 'ADMIN' ? (
            <p className="text-2xl">
              Start by <Link href="/admin/volumes" className="underline">adding a series</Link>
            </p>
          ) : (
            <p className="text-2xl">
              Your admin needs to add a series before you can add a book.
            </p>
          )}
        </div>
      ) : (
        <AllBooks series={series} />
      )}
    </div>
  );
};

export default AddNew;
