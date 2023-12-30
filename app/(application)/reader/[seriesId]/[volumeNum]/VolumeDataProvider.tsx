"use client";

import { createContext, useContext } from "react";

const VolumeContext = createContext({
  currentPage: 0,
  useTwoPages: false,
  firstPageIsCover: false,
});

export function useVolumeContext() {
  return useContext(VolumeContext);
}

export default function VolumeDataProvider({
  children,
  volume,
  userSetting
}: {
  children: React.ReactNode;
  volume: any;
}) {
  const getCurrentPage = () => {
    return volume.readings[0]?.page ?? 0;
  };

  const getUseTwoPages = () => {
    const defaultSetting = !!userSetting?.useTwoPages;
    const override = volume.readings[0]?.useTwoPagesOverride ?? null;
    console.log(defaultSetting, override);
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
  };

  return (
    <VolumeContext.Provider value={value}>{children}</VolumeContext.Provider>
  );
}
