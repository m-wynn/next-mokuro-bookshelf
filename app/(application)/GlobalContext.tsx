"use client";

import { createContext, useContext, useState } from "react";
import { Reading } from "volume";

const emptyReadings: Reading[] = [];

const GlobalContext = createContext({
  fullScreen: false,
  setFullScreen: (fullScreen: boolean) => {},
  allReadings: emptyReadings,
  setAllReadings: (allReadings: any) => {},
});

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export default function GlobalDataProvider({
  children,
  readings,
}: {
  children: React.ReactNode;
  readings: Reading[];
}) {
  const [fullScreen, setFullScreen] = useState(false);
  const [allReadings, setAllReadings] = useState<Reading[]>(readings);

  const value = {
    fullScreen,
    setFullScreen,
    allReadings,
    setAllReadings,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
