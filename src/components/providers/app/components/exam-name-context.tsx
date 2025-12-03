"use client";

import { createContext, useState } from "react";

type ExamNameContextType = {
  examName: string;
  setExamName: (name: string) => void;
};

export const ExamNameContext = createContext<ExamNameContextType>({
  examName: "",
  setExamName: () => {},
});

export function ExamNameProvider({ children }: { children: React.ReactNode }) {
  const [examName, setExamName] = useState("");
  return (
    <ExamNameContext.Provider value={{ examName, setExamName }}>
      {children}
    </ExamNameContext.Provider>
  );
}
