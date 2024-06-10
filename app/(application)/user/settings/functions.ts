'use server';

import prisma from 'db';
import { getSession } from 'lib/session';

interface UserPreferences {
  zoomSensitivity?: number;
  useTwoPages?: boolean;
  useJapaneseTitle?: boolean;
  showNsfwContent?: boolean;
  customTitleFormatString?: string;
}

export const updateUserPreference = async (preferences: UserPreferences) => {
  const session = await getSession('POST');
  const { userId } = session.user;
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
