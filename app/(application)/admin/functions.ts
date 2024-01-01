'use server';
import crypto from 'crypto';
import prisma from 'db';
import { promises as fs } from 'fs';
import { getSession } from 'lib/session';
import { SeriesInputs } from 'series';

export const createSeries = async (data: SeriesInputs) => {
  const session = await getSession('POST');
  if (!session) {
    throw new Error('Not logged in');
  }
  if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
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

export const createVolume = async (formData: FormData) => {
  const session = await getSession('POST');
  if (!session) {
    throw new Error('Not logged in');
  }

  if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
    throw new Error('Not authorized to do that');
  }

  const seriesId = formData.get('seriesId') as string;
  const volumeNumber = formData.get('volumeNumber') as string;
  const firstPageIsCover = formData.get('firstPageIsCover') === 'true';
  const coverImage = formData.get('coverImage') as Blob;

  if (seriesId == null || volumeNumber == null || coverImage == null) {
    throw new Error('Missing required fields');
  }

  const coverName = 'cover';

  const volume = await prisma.volume.upsert({
    where: {
      seriesNum: {
        number: parseInt(volumeNumber),
        seriesId: parseInt(seriesId),
      },
    },
    update: {
      cover: coverName,
      firstPageIsCover: firstPageIsCover,
    },
    create: {
      cover: coverName,
      number: parseInt(volumeNumber),
      seriesId: parseInt(seriesId),
      uploadedById: session.user.userId,
      firstPageIsCover: firstPageIsCover,
    },
  });

  const coverPath = `${process.env.IMAGE_PATH}/${volume.id}/cover/${coverName}`;

  await fs.mkdir(coverPath.split('/').slice(0, -1).join('/'), {
    recursive: true,
  });

  await fs.writeFile(coverPath, Buffer.from(await coverImage.arrayBuffer()));
  return volume;
};

export const createPage = async (formData: FormData) => {
  const session = await getSession('POST');
  if (!session) {
    throw new Error('Not logged in');
  }

  if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
    throw new Error('Not authorized to do that');
  }

  let volumeId = parseInt(formData.get('volumeId') as string);
  let number = parseInt(formData.get('number') as string);
  let ocr = formData.get('ocr') as Blob | null;
  let file = formData.get('file') as Blob;

  if (volumeId == null || number == null || file == null) {
    throw new Error('Missing required fields');
  }

  let ocrData = ocr != null ? JSON.parse(await ocr.text()) : null;

  const fileData = Buffer.from(await file.arrayBuffer());
  const fileName = getFileHash(fileData);

  await fs.writeFile(
    `${process.env.IMAGE_PATH}/${volumeId}/${fileName}`,
    fileData,
  );

  const page = await prisma.page.upsert({
    where: {
      volumeNum: {
        number: number,
        volumeId: volumeId,
      },
    },
    update: {
      number: number,
      volumeId: volumeId,
      ocr: ocrData,
      fileName: fileName,
      uploadedById: session.user.userId,
    },
    create: {
      number: number,
      volumeId: volumeId,
      ocr: ocrData,
      fileName: fileName,
      uploadedById: session.user.userId,
    },
  });
  return page;
};

const getFileHash = (fileData: Buffer): string => {
  const hash = crypto.createHash('sha256');
  hash.update(fileData);
  return hash.digest('hex');
};
