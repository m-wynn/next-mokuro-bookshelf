import PagesContainer from "./PagesContainer";
import VolumeDataProvider from "./VolumeDataProvider";
import prisma from "db";
import { auth } from "auth/lucia";
import * as context from "next/headers";

export type Page = {
  fileName: string;
  ocr: OcrContents | null;
  number: number;
};

type OcrContents = {
  version: string;
  img_width: number;
  img_height: number;
  blocks: OcrBlock[];
};

type OcrBlock = {
  box: number[];
  vertical: boolean;
  font_size: number;
  lines_coords: number[][];
  lines: string[];
};

export default async function Page({
  params: { seriesId, volumeNum },
}: {
  params: { seriesId: string; volumeNum: string };
}) {
  const session = await auth.handleRequest("GET", context).validate();
  const volume = await getVolume(seriesId, volumeNum, session.user.userId);
  if (!volume) return <div>Volume not found</div>;

  return (
    <VolumeDataProvider volume={volume}>
      <PagesContainer
        volumeId={volume.id}
        pages={volume.pages.map((page) => ({
          ...page,
          ocr: page.ocr as OcrContents,
        }))}
      />
    </VolumeDataProvider>
  );
}

const getVolume = async (seriesId, volumeNum, userId) => {
  return await prisma.volume.findUnique({
    where: {
      seriesNum: {
        number: parseInt(volumeNum),
        seriesId: parseInt(seriesId),
      },
    },
    select: {
      id: true,
      readings: {
        where: {
          userId: userId,
        },
        select: {
          page: true,
        },
      },
      pages: {
        select: {
          fileName: true,
          ocr: true,
          number: true,
        },
      },
    },
  });
}
