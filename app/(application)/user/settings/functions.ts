'use server';

import prisma from 'db';
import { getSession } from 'lib/session';

interface UserPreferences {
  zoomSensitivity?: number;
  useTwoPages?: boolean;
<<<<<<< Updated upstream
  useJapaneseTitle?: boolean;
  showNsfwContent?: boolean;
  customTitleFormatString?: string;
=======
  useJapaneseTitle?: boolean
>>>>>>> Stashed changes
}

export const updateUserPreference = async (preferences: UserPreferences) => {
  const session = await getSession('POST');
<<<<<<< Updated upstream
  const { userId } = session.user;
=======
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

const updateUserPreference = async (userId: string, preferences: UserPreferences) => {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  revalidatePath('/');
>>>>>>> Stashed changes
};
