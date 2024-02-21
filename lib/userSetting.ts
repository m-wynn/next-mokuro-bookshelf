import { Prisma } from '@prisma/client';
import prisma from 'db';

export const UserSettingSelectQuery = {
  useTwoPages: true,
  zoomSensitivity: true,
  useJapaneseTitle: true,
  showNsfwContent: true,
} satisfies Prisma.UserSettingSelect;

export type UserSetting = Prisma.UserSettingGetPayload<{
  select: typeof UserSettingSelectQuery;
}>;

export const UserSettingsDefaultValues: UserSetting = {
  useTwoPages: false,
  useJapaneseTitle: false,
  zoomSensitivity: 1,
  showNsfwContent: false,
};

export async function shouldShowNsfw(userId: string) {
  const userSetting = await prisma.userSetting.findUnique({
    where: {
      userId,
    },
    select: {
      showNsfwContent: true,
    },
  });
  return userSetting?.showNsfwContent;
}
