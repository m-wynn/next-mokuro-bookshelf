'use server';
import prisma from 'db';
import { getSession } from 'lib/session';
import { revalidatePath } from 'next/cache';

interface UserPreferences {
  zoomSensitivity?: number;
  useTwoPages?: boolean;
  useJapaneseTitle?: boolean
};

export const updateUseTwoPages = async (useTwoPages: boolean) => {
  const session = await getSession('POST');
  updateUserPreference(session.user.userId, { useTwoPages })
};

export const updateZoomSensitivity = async (zoomSensitivity: number) => {
  const session = await getSession('POST');
  updateUserPreference(session.user.userId, { zoomSensitivity });
};

export const updateUseJapaneseTitle = async (useJapaneseTitle: boolean) => {
  const session = await getSession('POST');
  updateUserPreference(session.user.userId, { useJapaneseTitle });
};

const updateUserPreference = async (userId: string, preferences: UserPreferences) => {
  await prisma.userSetting.upsert({
    where: {
      userId,
    },
    update: {
      ...preferences
    },
    create: {
      userId,
      ...preferences
    },
  });
  revalidatePath('/');
}
