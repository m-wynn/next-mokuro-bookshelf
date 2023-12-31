"use server";
import prisma from "db";
import { promises as fs } from "fs";
import { getSession } from "lib/session";
import { SeriesInputs } from "series";
import { VolumeFields } from "./volumes/[[...volumeid]]/page";

export const createSeries = async (data: SeriesInputs) => {
  const session = await getSession("POST");
  if (!session) {
    throw new Error("Not logged in");
  }
  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error(
      `Not authorized to upload ${session.user.role} is not "ADMIN"`,
    );
  }
  const series = await prisma.series.create({
    data: {
      englishName: data.englishName,
      japaneseName: data.japaneseName,
      uploadedById: session.user.userId,
    },
  });

  return series;
};

export const createVolume = async ({
  seriesId,
  volumeNumber,
  coverImage,
  firstPageIsCover,
}: VolumeFields) => {
  const session = await getSession("POST");
  if (!session) {
    throw new Error("Not logged in");
  }

  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Not authorized to do that");
  }

  const volume = await prisma.volume.upsert({
    where: {
      seriesNum: {
        number: volumeNumber,
        seriesId: parseInt(seriesId),
      },
    },
    update: {
      cover: coverImage[0].name,
      firstPageIsCover: firstPageIsCover,
    },
    create: {
      cover: coverImage[0].name,
      number: volumeNumber,
      seriesId: parseInt(seriesId),
      uploadedById: session.user.userId,
      firstPageIsCover: firstPageIsCover,
    },
  });

  const coverPath = `${process.env.IMAGE_PATH}/${volume.id}/cover/${coverImage[0].name}`;

  await fs.mkdir(coverPath.split("/").slice(0, -1).join("/"), {
    recursive: true,
  });

  await fs.writeFile(coverPath, Buffer.from(await coverImage[0].arrayBuffer()));
  return volume;
};

export const createPage = async ({
  volumeId,
  pageNum,
  ocr,
  image,
}: {
  volumeId: number;
  pageNum: number;
  ocr: Blob | null;
  image: Blob;
}) => {
  const session = await getSession("POST");
  if (!session) {
    throw new Error("Not logged in");
  }

  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Not authorized to do that");
  }
  let ocrData = ocr != null ? JSON.parse(await ocr.text()) : null;

  await fs.writeFile(
    `${process.env.IMAGE_PATH}/${volumeId}/${pageNum}-${image.name}`,
    Buffer.from(await image.arrayBuffer()),
  );

  const page = await prisma.page.upsert({
    where: {
      volumeNum: {
        number: pageNum,
        volumeId: volumeId,
      },
    },
    update: {
      number: pageNum,
      volumeId: volumeId,
      ocr: ocrData,
      fileName: `${pageNum}-${image.name}`,
      uploadedById: session.user.userId,
    },
    create: {
      number: pageNum,
      volumeId: volumeId,
      ocr: ocrData,
      fileName: `${pageNum}-${image.name}`,
      uploadedById: session.user.userId,
    },
  });
  return page;
};
