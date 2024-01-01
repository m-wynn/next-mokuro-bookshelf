import PagesContainer from './PagesContainer';
import VolumeDataProvider from './VolumeDataProvider';
import prisma from 'db';
import { auth } from 'auth/lucia';
import * as context from 'next/headers';
import { OcrPage } from 'page';
import { Prisma } from '@prisma/client';

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

const getUserSetting = async (userId: string) => {
  return await prisma.userSetting.findUnique({
    where: {
      userId: userId,
    },
  });
};

const getVolume = async (
  seriesId: string,
  volumeNum: string,
  userId: string,
) => {
  return await prisma.volume.findUnique({
    where: {
      seriesNum: {
        number: parseInt(volumeNum),
        seriesId: parseInt(seriesId),
      },
    },
    select: VolumeSelectQuery(userId),
  });
};

const PageSelectQuery = {
  id: true,
  ocr: true,
  number: true,
};

const VolumeSelectQuery = (userId: string) =>
  ({
    id: true,
    firstPageIsCover: true,
    readings: {
      where: {
        userId: userId,
      },
      select: {
        page: true,
        useTwoPagesOverride: true,
        firstPageIsCoverOverride: true,
      },
    },
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
