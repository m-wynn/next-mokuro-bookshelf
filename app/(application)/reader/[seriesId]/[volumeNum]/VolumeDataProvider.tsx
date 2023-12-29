"use client";

import { DataType, DataValuesType } from '@/types/Data'
import { createContext, useState, useContext, useEffect } from 'react'

const VolumeContext = createContext({
  currentPage: 0,
  useTwoPages: false,
  firstPageIsCover: false
});

export function useVolumeContext() {
  return useContext(VolumeContext);
}

export default function VolumeDataProvider({ children, volume }: { children: React.ReactNode }) {
  const getCurrentPage = () => {
    return volume.readings[0].page ?? 0;
  }

  const getUseTwoPages = () => {
    const defaultSetting = !!volume.readings[0]?.user.UserSetting?.useTwoPages;
    const override = volume.readings[0]?.useTwoPagesOverride;
    if (override === null) {
      return defaultSetting;
    }
    return override;
  }

  const getFirstPageIsCover = () => {
    const defaultSetting = volume.firstPageIsCover;
    const override = volume.readings[0]?.firstPageIsCoverOverride;
    if (override === null) {
      return defaultSetting;
    }
    return override;
  }

  const value = {
    currentPage: getCurrentPage(),
    useTwoPages: getUseTwoPages(),
    firstPageIsCover: getFirstPageIsCover()
  }

  return <VolumeContext.Provider value={value}>{children}</VolumeContext.Provider>
}
