'use server';

import { Prisma } from '@prisma/client';
import prisma from 'db';
import { promises as fs } from 'fs';
import { getSession } from 'lib/session';
import { revalidatePath } from 'next/cache';

export const updateSeries = async (
  id: number,
  series: Prisma.SeriesUpdateInput,
) => {
  'use server';

  const session = await getSession('POST');
  if (['ADMIN', 'EDITOR'].includes(session.user.role)) {
    await prisma.series.update({
      where: {
        id,
      },
      data: series,
    });
    revalidatePath('/');
  } else {
    throw new Error('Unauthorized');
  }
};

async function deleteVolumeById(volumeId: number) {
  await prisma.$transaction([
    prisma.reading.deleteMany({ where: { volumeId } }),
    prisma.page.deleteMany({ where: { volumeId } }),
    prisma.ePub.deleteMany({ where: { volumeId } }),
    prisma.volume.delete({ where: { id: volumeId } }),
  ]);

  await fs.rm(`${process.env.IMAGE_PATH}/${volumeId}`, {
    recursive: true,
    force: true,
  });
}

export const deleteVolume = async (volumeId: number) => {
  'use server';

  const session = await getSession('POST');
  if (session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (!Number.isSafeInteger(volumeId)) {
    throw new Error('Invalid volume ID');
  }

  const volume = await prisma.volume.findUnique({
    where: { id: volumeId },
    select: { id: true },
  });
  if (!volume) {
    throw new Error('Volume not found');
  }

  await deleteVolumeById(volumeId);

  revalidatePath('/');
};

export const deleteSeries = async (seriesId: number) => {
  'use server';

  const session = await getSession('POST');
  if (session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const series = await prisma.series.findUnique({
    where: { id: seriesId },
    select: {
      id: true,
      volumes: { select: { id: true } },
    },
  });
  if (!series) {
    throw new Error('Series not found');
  }

  await Promise.all(series.volumes.map((volume) => deleteVolumeById(volume.id)));

  await prisma.series.delete({ where: { id: seriesId } });

  revalidatePath('/');
};
