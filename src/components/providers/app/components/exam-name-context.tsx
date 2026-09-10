"use client";

import { createContext, useEffect, useState } from "react";

type ExamNameContextType = {
  examName: string;
  setExamName: (name: string) => void;
  diplomaName: string;
  setDiplomaName: (name: string) => void;
};

export const ExamNameContext = createContext<ExamNameContextType>({
  examName: "",
  setExamName: () => {},
  diplomaName: "",
  setDiplomaName: () => {},
});

export function ExamNameProvider({ children }: { children: React.ReactNode }) {
  const [examName, setExamName] = useState("");
  const [diplomaName, setDiplomaName] = useState("");

  useEffect(() => {
    const savedExam = localStorage.getItem("examName");
    const savedDiploma = localStorage.getItem("diplomaName");
    if (savedExam) setExamName(savedExam);
    if (savedDiploma) setDiplomaName(savedDiploma);
  }, []);

  useEffect(() => {
    if (examName) {
      localStorage.setItem("examName", examName);
    } else {
      localStorage.removeItem("examName");
    }
  }, [examName]);

  useEffect(() => {
    if (diplomaName) {
      localStorage.setItem("diplomaName", diplomaName);
    } else {
      localStorage.removeItem("diplomaName");
    }
  }, [diplomaName]);

  return (
    <ExamNameContext.Provider
      value={{ examName, setExamName, diplomaName, setDiplomaName }}
    >
      {children}
    </ExamNameContext.Provider>
  );
}
