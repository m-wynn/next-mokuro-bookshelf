"use client";

import { DataType, DataValuesType } from '@/types/Data'
import { createContext, useState, useContext, useEffect } from 'react'

const VolumeContext = createContext({
  currentPage: 1,
  useTwoPages: false,
  firstPageIsCover: false
});

export function useVolumeContext() {
  return useContext(VolumeContext);
}

export default function VolumeDataProvider({ children, volumeId }: { children: React.ReactNode }) {
  const getCurrentPage = () => {
    return 0;
  }

  const getUseTwoPages = () => {
    return false;
  }

  const getFirstPageIsCover = () => {
    return false;
  }

  const value = {
    volumeId: volumeId,
    currentPage: getCurrentPage(),
    useTwoPages: getUseTwoPages(),
    firstPageIsCover: getFirstPageIsCover()
  }

  return <VolumeContext.Provider value={value}>{children}</VolumeContext.Provider>
}