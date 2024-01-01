'use client';

import { createContext, useContext, useState } from 'react';
import { Reading } from 'lib/reading';

const emptyReadings: Reading[] = [];

const GlobalContext = createContext({
  fullScreen: false,
  setFullScreen: (fullScreen: boolean) => {},
  allReadings: emptyReadings,
  setAllReadings: (allReadings: any) => {},
  useJapaneseTitle: false,
});

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export default function GlobalDataProvider({
  children,
  readings,
  useJapaneseTitle,
}: {
  children: React.ReactNode;
  readings: Reading[];
  useJapaneseTitle: boolean;
}) {
  const [fullScreen, setFullScreen] = useState(false);
  const [allReadings, setAllReadings] = useState<Reading[]>(readings);

  const value = {
    fullScreen,
    setFullScreen,
    allReadings,
    setAllReadings,
    useJapaneseTitle,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
