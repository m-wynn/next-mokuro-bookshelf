'use client';

import { createContext, useContext, useState } from 'react';
import { Reading } from 'lib/reading';
import { UserSetting, UserSettingsDefaultValues } from 'lib/userSetting';

const emptyReadings: Reading[] = [];

const GlobalContext = createContext({
  fullScreen: false,
  setFullScreen: (fullScreen: boolean) => {},
  allReadings: emptyReadings,
  setAllReadings: (allReadings: any) => {},
  userSettings: UserSettingsDefaultValues,
  setUserSettings: (userSettings: any) => {},
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
  const [userSettings, setUserSettings] = useState<UserSetting>(initialUserSettings ?? UserSettingsDefaultValues);

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
