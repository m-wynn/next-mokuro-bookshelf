import { Prisma } from '@prisma/client';

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
