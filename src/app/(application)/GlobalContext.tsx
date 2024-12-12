'use client';

import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { UserSetting, UserSettingsDefaultValues } from 'lib/userSetting';
import type { Reading } from 'lib/reading';

const emptyReadings: Reading[] = [];

const GlobalContext = createContext({
  fullScreen: false,
  setFullScreen: (_fullScreen: boolean) => {},
  maximizeReader: false,
  setMaximizeReader: (_maximizeReader: boolean) => {},
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [fullScreen, _setFullScreen] = useState(false);
  const [maximizeReader, setMaximizeReader] = useState(false);
  const [allReadings, setAllReadings] = useState<Reading[]>(readings);
  const [userSettings, setUserSettings] = useState<UserSetting>(
    initialUserSettings ?? UserSettingsDefaultValues,
  );

  const setFullScreen = (value: boolean) => {
    if (value) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const callback = () => {
      _setFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', callback);
    return () => document.removeEventListener('fullscreenchange', callback);
  }, [_setFullScreen]);

  // This won't get a performance benefit from useMemo
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    fullScreen,
    setFullScreen,
    maximizeReader,
    setMaximizeReader,
    allReadings,
    setAllReadings,
    userSettings,
    setUserSettings,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
