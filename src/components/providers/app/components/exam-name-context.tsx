"use client";

import { createContext, useEffect, useState } from "react";

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

  useEffect(() => {
    const savedName = localStorage.getItem("examName");
    if (savedName) {
      setExamName(savedName);
    }
  }, []);

  useEffect(() => {
    if (examName) {
      localStorage.setItem("examName", examName);
    }
  }, [examName]);

  return (
    <ExamNameContext.Provider value={{ examName, setExamName }}>
      {children}
    </ExamNameContext.Provider>
  );
}
