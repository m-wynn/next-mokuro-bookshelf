import { createContext, useCallback, useContext, useState } from "react";

const SessionContext = createContext(undefined as any);

export function useSessionId(): string | null {
  return useContext(SessionContext).sessionId;
}

export function useSetSessionId(): (sessionId: string | null) => void {
  return useContext(SessionContext).setSessionId;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionIdState] = useState(getSavedSessionId());
  const setSessionId = useCallback(
    (value: string | null) => {
      setSavedSessionId(value);
      setSessionIdState(value);
    },
    [setSessionIdState],
  );
  return (
    <SessionContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </SessionContext.Provider>
  );
}

function getSavedSessionId() {
  return localStorage.getItem("sessionId");
}

export function setSavedSessionId(sessionId: string | null) {
  if (sessionId == null) {
    localStorage.removeItem("sessionId");
  } else {
    localStorage.setItem("sessionId", sessionId);
  }
}
