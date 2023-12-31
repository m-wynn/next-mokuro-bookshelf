import { Prisma } from "@prisma/client";

export const UserSettingSelectQuery = {
  useTwoPages: true,
  zoomSensitivity: true
} satisfies Prisma.UserSettingSelect;

export type UserSetting = Prisma.UserSettingGetPayload<{
  select: typeof UserSettingSelectQuery;
}>;
