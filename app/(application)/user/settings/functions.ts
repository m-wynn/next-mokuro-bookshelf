'use server';
import prisma from 'db';
import { getSession } from 'lib/session';
import { revalidatePath } from 'next/cache';

export const updateUseTwoPages = async (useTwoPages: boolean) => {
  const session = await getSession('POST');
  await prisma.userSetting.upsert({
    where: {
      userId: session.user.userId,
    },
    update: {
      useTwoPages,
    },
    create: {
      userId: session.user.userId,
      useTwoPages,
    },
  });
  revalidatePath('/');
};

export const updateZoomSensitivity = async (zoomSensitivity: number) => {
  const session = await getSession('POST');
  await prisma.userSetting.upsert({
    where: {
      userId: session.user.userId,
    },
    update: {
      zoomSensitivity,
    },
    create: {
      userId: session.user.userId,
      zoomSensitivity,
    },
  });
  revalidatePath('/');
};

export const updateUseJapaneseTitle = async (useJapaneseTitle: boolean) => {
  const session = await getSession('POST');
  await prisma.userSetting.upsert({
    where: {
      userId: session.user.userId,
    },
    update: {
      useJapaneseTitle,
    },
    create: {
      userId: session.user.userId,
      useJapaneseTitle,
    },
  });
  revalidatePath('/');
};
