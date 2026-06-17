import { Prisma } from '@prisma/client';
import { initializeContext, clearContext } from 'auth/context-adapter';
import * as context from 'auth/context-adapter';
import { auth } from 'auth/lucia';
import prisma from 'db';
import type { OcrPage } from 'page';
import PagesContainer from './PagesContainer';
import VolumeDataProvider from './VolumeDataProvider';
import EPubContainer from './EPubContainer';

const PageSelectQuery = {
  id: true,
  ocr: true,
  number: true,
};

const VolumeSelectQuery = (userId: string) => ({
  id: true,
  number: true,
  firstPageIsCover: true,
  readings: {
    where: {
      userId,
    },
    select: {
      page: true,
      epubPage: true,
      useTwoPagesOverride: true,
      firstPageIsCoverOverride: true,
    },
  },
  series: {
    select: {
      englishName: true,
      japaneseName: true,
      shortName: true,
    },
  },
  pages: {
    select: PageSelectQuery,
    orderBy: {
      number: 'asc',
    },
  },
  epub: {
    select: {
      id: true,
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
  params,
}: {
  params: Promise<{ seriesId: string; volumeNum: string }>;
}) {
  const { seriesId, volumeNum } = await params;
  await initializeContext();
  try {
    const session = await auth.handleRequest('GET', context).validate();
    const volume = await getVolume(seriesId, volumeNum, session.user.userId);
    if (!volume) return <div>Volume not found</div>;

    return (
      <VolumeDataProvider volume={volume}>
        {volume.epub ? (
          <EPubContainer volume={volume} />
        ) : (
          <PagesContainer
            volumeId={volume.id}
            pages={volume.pages.map((page: Page) => ({
              ...page,
              ocr: page.ocr as unknown as OcrPage,
            }))}
          />
        )}
      </VolumeDataProvider>
    );
  } finally {
    clearContext();
  }
}
