'use client';

import { UserSetting, UserSettingsDefaultValues } from 'lib/userSetting';
import { createContext, useContext } from 'react';
import { useGlobalContext } from 'app/(application)/GlobalContext';
import type { Volume } from './page';

const { useTwoPages, zoomSensitivity } = UserSettingsDefaultValues;
const VolumeContext = createContext({
  currentPage: 0,
  firstPageIsCover: false,
  useTwoPages,
  zoomSensitivity
});

export function useVolumeContext() {
  return useContext(VolumeContext);
}

export default function VolumeDataProvider({
  children,
  volume
}: {
  children: React.ReactNode;
  volume: Volume;
}) {
  const { userSettings } = useGlobalContext();

  const getZoomSensitivity = () => {
    return userSettings?.zoomSensitivity ?? 1;
  };

  const getCurrentPage = () => {
    let page = volume.readings[0]?.page ?? 0;
    if (
      page > 0 &&
      getUseTwoPages() &&
      getFirstPageIsCover() &&
      page % 2 == 0
    ) {
      return page - 1;
    }
    return page;
  };

  const getUseTwoPages = () => {
    const defaultSetting = !!userSettings?.useTwoPages;
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
    zoomSensitivity: getZoomSensitivity(),
  };

  return (
    <VolumeContext.Provider value={value}>{children}</VolumeContext.Provider>
  );
}
