"use client";

import { UserSetting } from "lib/userSetting";
import { createContext, useContext } from "react";
import { Volume } from "./page";

const VolumeContext = createContext({
  currentPage: 0,
  useTwoPages: false,
  firstPageIsCover: false,
  zoomSensitivity: 1,
});

export function useVolumeContext() {
  return useContext(VolumeContext);
}

export default function VolumeDataProvider({
  children,
  volume,
  userSetting,
}: {
  children: React.ReactNode;
  volume: Volume;
  userSetting: UserSetting | null;
}) {
  const getZoomSensitivity = () => {
    return userSetting?.zoomSensitivity ?? 1;
  }

  const getCurrentPage = () => {
    let page = volume.readings[0]?.page ?? 0;
    if (page > 0 && getUseTwoPages() && getFirstPageIsCover() && page % 2 == 0) {
      return page - 1;
    }
    return page;
  };

  const getUseTwoPages = () => {
    const defaultSetting = !!userSetting?.useTwoPages;
    const override = volume.readings[0]?.useTwoPagesOverride ?? null;
    if (override === null) {
      return defaultSetting;
    }
    return override;
  };

  const getFirstPageIsCover = () => {
    const defaultSetting = volume.firstPageIsCover;
    const override = volume.readings[0]?.firstPageIsCoverOverride ?? null;
    if (override === null) {
      return defaultSetting;
    }
    return override;
  };

  const value = {
    currentPage: getCurrentPage(),
    useTwoPages: getUseTwoPages(),
    firstPageIsCover: getFirstPageIsCover(),
    zoomSensitivity: getZoomSensitivity()
  };

  return (
    <VolumeContext.Provider value={value}>{children}</VolumeContext.Provider>
  );
}
