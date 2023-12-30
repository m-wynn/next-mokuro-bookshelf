import Head from "next/head";
import prisma from "db";
import VolumeCard from "@/volumecard";

const AddNew = async () => {
  const series = await prisma.series.findMany({
    select: {
      name: true,
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
    },
  });

  return (
    <div className="p-5 latte bg-crust text-text">
      <Head>
        <title>All Series</title>
        <meta charSet="utf-8" />
      </Head>
      {series.map(({ name, id, volumes }) => (
        <div key={name} className="mb-4 w-full">
          <div className="flex-initial p-4 w-full shadow-md bg-base-200">
            <h3 className="mb-2 text-3xl font-bold">{name}</h3>
            <div key={name} className="flex flex-wrap mb-4 w-full">
              {volumes?.map((volume) => (
                <VolumeCard
                  key={volume.id}
                  coverUri={`/api/volume/${volume.id}/cover/`}
                  pagesRead={volume.readings[0]?.page ?? 0}
                  totalPages={volume._count.pages}
                  href={`/reader/${id}/${volume.number}`}
                  seriesName={name}
                  volumeNumber={volume.number}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddNew;
