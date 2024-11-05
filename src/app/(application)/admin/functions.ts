'use server';

import { Reading } from '@prisma/client';
import prisma from 'db';
import { promises as fs } from 'fs';
import { getSession } from 'lib/session';
import type { SeriesInputs } from 'series';

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
      isNsfw: data.isNsfw,
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
        number: +volumeNumber,
        seriesId: +seriesId,
      },
    },
    update: {
      cover: coverName,
      firstPageIsCover,
    },
    create: {
      cover: coverName,
      number: +volumeNumber,
      seriesId: +seriesId,
      uploadedById: session.user.userId,
      firstPageIsCover,
    },
  });

  // Delete all pages in case of reupload
  await prisma.page.deleteMany({
    where: {
      volumeId: volume.id,
    },
  });

  const coverPath = `${process.env.IMAGE_PATH}/${volume.id}/cover/${coverName}`;

  await fs.mkdir(coverPath.split('/').slice(0, -1).join('/'), {
    recursive: true,
  });

  await fs.writeFile(coverPath, Buffer.from(await coverImage.arrayBuffer()));
  return volume;
};

export async function updateExistingReadingsAfterUpload(volumdId: number) {
  const readings = await prisma.reading.findMany({
    where: {
      volumeId: volumdId,
    },
  });

  const maxPages = await prisma.page.findMany({
    where: {
      volumeId: volumdId,
    },
    select: {
      number: true,
    },
    orderBy: {
      number: 'desc',
    },
  });

  if (!maxPages) { return; }
  const maxPage = maxPages[0];

  await Promise.all(
    readings.map((reading: Reading) => {
      if (reading.page > maxPage.number) {
        return prisma.reading.update({
          where: {
            id: reading.id,
          },
          data: {
            page: maxPage.number,
          },
        });
      }
      return null;
    }),
  );
}
