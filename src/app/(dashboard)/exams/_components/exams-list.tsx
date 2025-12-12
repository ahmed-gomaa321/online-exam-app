"use client";

import { Timer } from "lucide-react";
import Loading from "../../loading";
import useExams from "../_hooks/use-exams";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { useContext, useEffect } from "react";
import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ExamsList() {
  // hooks
  const isMobile = useIsMobile();
  // context
  const { setExamName } = useContext(ExamNameContext);

  const { data: exams, isLoading, error } = useExams();

  // remove all saved local storage data when the component unmounts
  useEffect(() => {
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach((key) => {
      if (key.startsWith("exam-") || key.startsWith("time-")) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  if (error)
    return (
      <p className="bg-red-50 p-4 mt-4 text-red-600 font-medium">
        Error: {error.message}
      </p>
    );

  if (isLoading) return <Loading />;

  return (
    <section className="bg-white p-6 flex flex-col gap-4">
      {exams &&
        exams?.exams.map((exam) => (
          <Link
            href={ROUTES.EXAM_QUESTIONS.replace(":id", exam._id)}
            onClick={() => setExamName(exam?.title)}
            key={exam._id}
            className="p-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors duration-300 cursor-pointer active:scale-90 xl:active:scale-100"
          >
            <div className="flex flex-col gap-1">
              <p className="text-blue-600 fw-semibold text-xs md:text-base xl:text-xl">
                {exam.title}
              </p>
              <span className="text-gray-500 text-xs md:text-base">
                {exam.numberOfQuestions} Questions
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Timer className="w-6 h-6 text-gray-400" />
              <p className="text-gray-800 font-medium text-xs md:text-sm flex gap-1">
                duration:
                <span>
                  {exam.duration} {isMobile ? "min" : "minutes"}
                </span>
              </p>
            </div>
          </Link>
        ))}
      <p className="mt-4 p-2 text-gray-600 text-center">End of list</p>
    </section>
  );
}
