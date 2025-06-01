import React, { createContext, useContext, useState } from "react";

type TimerContextType = {
  anyRunning: boolean;
  setAnyRunning: (v: boolean) => void;
};

const TimerContext = createContext<TimerContextType>({
  anyRunning: false,
  setAnyRunning: () => {},
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [anyRunning, setAnyRunning] = useState(false);
  return (
    <TimerContext.Provider value={{ anyRunning, setAnyRunning }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  return useContext(TimerContext);
}