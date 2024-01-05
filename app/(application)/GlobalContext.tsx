'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserSetting, UserSettingsDefaultValues } from 'lib/userSetting';
import type { Reading } from 'lib/reading';

const emptyReadings: Reading[] = [];

const GlobalContext = createContext({
  fullScreen: false,
  setFullScreen: (_fullScreen: boolean) => {},
  allReadings: emptyReadings,
  setAllReadings: (_allReadings: any) => {},
  userSettings: UserSettingsDefaultValues,
  setUserSettings: (_userSettings: any) => {},
});

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export default function GlobalDataProvider({
  children,
  readings,
  initialUserSettings,
}: {
  children: React.ReactNode;
  readings: Reading[];
  initialUserSettings: UserSetting | null;
}) {
  const [fullScreen, setFullScreen] = useState(false);
  const [allReadings, setAllReadings] = useState<Reading[]>(readings);
  const [userSettings, setUserSettings] = useState<UserSetting>(
    initialUserSettings ?? UserSettingsDefaultValues,
  );

  // This won't get a performance benefit from useMemo
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    fullScreen,
    setFullScreen,
    allReadings,
    setAllReadings,
    userSettings,
    setUserSettings,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
