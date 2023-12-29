"use client";

import { createContext, useContext, useState } from "react";

const GlobalContext = createContext({
  fullScreen: false,
  setFullScreen: (fullScreen: boolean) => {},
});

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export default function GlobalDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fullScreen, setFullScreen] = useState(false);

  const value = {
    fullScreen,
    setFullScreen,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
