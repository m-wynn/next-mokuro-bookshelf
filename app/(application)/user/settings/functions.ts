'use server';

import prisma from 'db';
import { getSession } from 'lib/session';

interface UserPreferences {
  zoomSensitivity?: number;
  useTwoPages?: boolean;
  useJapaneseTitle?: boolean;
  showNsfwContent?: boolean;
}

const updateUserPreference = async (userId: string, preferences: UserPreferences) => {
  await prisma.userSetting.upsert({
    where: {
      userId,
    },
    update: {
      ...preferences,
    },
    create: {
      userId,
      ...preferences,
    },
  });
};
export const updateUseTwoPages = async (useTwoPages: boolean) => {
  const session = await getSession('POST');
  await updateUserPreference(session.user.userId, { useTwoPages });
};

export const updateZoomSensitivity = async (zoomSensitivity: number) => {
  const session = await getSession('POST');
  await updateUserPreference(session.user.userId, { zoomSensitivity });
};

export const updateUseJapaneseTitle = async (useJapaneseTitle: boolean) => {
  const session = await getSession('POST');
  await updateUserPreference(session.user.userId, { useJapaneseTitle });
};

export const updateShowNsfwContent = async (showNsfwContent: boolean) => {
  const session = await getSession('POST');
  await updateUserPreference(session.user.userId, { showNsfwContent });
};
