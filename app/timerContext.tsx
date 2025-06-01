import React, { createContext, useContext, useState } from "react";

type TimerContextType = {
  anyRunning: boolean;
  setAnyRunning: (v: boolean) => void;
  runningTimerId: number | null;
  setRunningTimerId: (id: number | null) => void;
};

const TimerContext = createContext<TimerContextType>({
  anyRunning: false,
  setAnyRunning: () => {},
  runningTimerId: null,
  setRunningTimerId: () => {},
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [anyRunning, setAnyRunning] = useState(false);
  const [runningTimerId, setRunningTimerId] = useState<number | null>(null);
  return (
    <TimerContext.Provider value={{ anyRunning, setAnyRunning, runningTimerId, setRunningTimerId }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  return useContext(TimerContext);
}