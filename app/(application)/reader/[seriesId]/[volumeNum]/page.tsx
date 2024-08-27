<<<<<<< Updated upstream
import { Prisma } from '@prisma/client';
import { auth } from 'auth/lucia';
import prisma from 'db';
import * as context from 'next/headers';
import type { OcrPage } from 'page';
import PagesContainer from './PagesContainer';
import VolumeDataProvider from './VolumeDataProvider';
=======
import prisma from 'db';
import { auth } from 'auth/lucia';
import * as context from 'next/headers';
import { OcrPage } from 'page';
import { Prisma } from '@prisma/client';
import VolumeDataProvider from './VolumeDataProvider';
import PagesContainer from './PagesContainer';

export default async function Page({
  params: { seriesId, volumeNum },
}: {
  params: { seriesId: string; volumeNum: string };
}) {
  const session = await auth.handleRequest('GET', context).validate();
  const volume = await getVolume(seriesId, volumeNum, session.user.userId);
  const userSetting = await getUserSetting(session.user.userId);
  if (!volume) return <div>Volume not found</div>;

  return (
    <VolumeDataProvider volume={volume} userSetting={userSetting}>
      <PagesContainer
        volumeId={volume.id}
        pages={volume.pages.map((page) => ({
          ...page,
          ocr: page.ocr as unknown as OcrPage,
        }))}
      />
    </VolumeDataProvider>
  );
}

const getUserSetting = async (userId: string) => await prisma.userSetting.findUnique({
  where: {
    userId,
  },
});

const getVolume = async (
  seriesId: string,
  volumeNum: string,
  userId: string,
) => await prisma.volume.findUnique({
  where: {
    seriesNum: {
      number: parseInt(volumeNum),
      seriesId: parseInt(seriesId),
    },
  },
  select: VolumeSelectQuery(userId),
});
>>>>>>> Stashed changes

const PageSelectQuery = {
  id: true,
  ocr: true,
  number: true,
};

const VolumeSelectQuery = (userId: string) => ({
  id: true,
<<<<<<< Updated upstream
  number: true,
=======
>>>>>>> Stashed changes
  firstPageIsCover: true,
  readings: {
    where: {
      userId,
    },
    select: {
      page: true,
      useTwoPagesOverride: true,
      firstPageIsCoverOverride: true,
    },
  },
<<<<<<< Updated upstream
  series: {
    select: {
      englishName: true,
      japaneseName: true,
      shortName: true,
    },
  },
=======
>>>>>>> Stashed changes
  pages: {
    select: PageSelectQuery,
    orderBy: {
      number: 'asc',
    },
  },
}) satisfies Prisma.VolumeSelect;

export type Volume = Prisma.VolumeGetPayload<{
  select: ReturnType<typeof VolumeSelectQuery>;
}>;

export type Page = Prisma.PageGetPayload<{
  select: typeof PageSelectQuery;
}>;

const getVolume = async (
  seriesId: string,
  volumeNum: string,
  userId: string,
) => prisma.volume.findUnique({
  where: {
    seriesNum: {
      number: parseInt(volumeNum, 10),
      seriesId: parseInt(seriesId, 10),
    },
  },
  select: VolumeSelectQuery(userId),
});

export default async function PageComponent({
  params: { seriesId, volumeNum },
}: {
  params: { seriesId: string; volumeNum: string };
}) {
  const session = await auth.handleRequest('GET', context).validate();
  const volume = await getVolume(seriesId, volumeNum, session.user.userId);
  if (!volume) return <div>Volume not found</div>;

  return (
    <VolumeDataProvider volume={volume}>
      <PagesContainer
        volumeId={volume.id}
        pages={volume.pages.map((page: Page) => ({
          ...page,
          ocr: page.ocr as unknown as OcrPage,
        }))}
      />
    </VolumeDataProvider>
  );
}
