"use client";

import { ArrowRight, CircleQuestionMark, Timer } from "lucide-react";
import useExams from "../_hooks/use-exams";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { useContext, useEffect } from "react";
import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorAlert from "@/app/(auth)/_components/error-alert";
import Image from "next/image";
import ExamsListSkeleton from "./exams-list-skeleton";

export default function ExamsList({ id }: { id: string }) {
  // hooks
  const isMobile = useIsMobile();
  // context
  const { setExamName, setDiplomaName } = useContext(ExamNameContext);
  // tanstack query
  const { data: diplomasExams, isLoading, error } = useExams(id);

  useEffect(() => {
    setExamName("");

    if (
      diplomasExams &&
      diplomasExams?.status &&
      diplomasExams?.payload?.diploma?.title
    ) {
      setDiplomaName(diplomasExams.payload.diploma.title);
    }
  }, [diplomasExams, setExamName, setDiplomaName]);

  if (isLoading) {
    return (
      <div className="px-4 xl:px-0 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ExamsListSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="mt-3 px-4">
        <ErrorAlert message={error?.message} />
      </div>
    );

  const exams =
    diplomasExams && diplomasExams.status
      ? diplomasExams.payload.diploma?.exams
      : [];

  if (exams.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No exams available for this diploma.
      </div>
    );
  }
  return (
    <section className="bg-white px-6 flex flex-col gap-4">
      {exams.map((exam) => (
        <Link
          href={ROUTES.EXAM_QUESTIONS.replace(":id", exam.id)}
          onClick={() => setExamName(exam?.title)}
          key={exam?.id}
          className="group relative overflow-hidden p-4 flex items-center gap-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-300 cursor-pointer border border-transparent hover:border-blue-500 hover:border-dashed"
        >
          <figure className="w-[100px] h-[100px] relative overflow-hidden">
            <Image
              quality={100}
              src={
                exam?.image || "../../../../../public/assets/images/logo.svg"
              }
              alt={exam?.title}
              fill
              sizes="100%"
              className="object-contain hover:scale-105 transition-all duration-300"
            />
          </figure>
          <div className="flex flex-col gap-2 flex-1 mb-auto">
            <div className="flex items-center justify-between">
              <p className="text-blue-600 font-semibold text-xs md:text-base xl:text-xl">
                {exam?.title}
              </p>
              <div className="text-xs flex items-center space-x-1">
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <CircleQuestionMark size={18} /> {exam?.questionsCount}{" "}
                  {isMobile ? "ques" : "questions"}
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <Timer size={18} /> {exam?.duration}{" "}
                  {isMobile ? "min" : "minutes"}
                </span>
              </div>
            </div>
            <p className="text-gray-500 font-medium text-xs md:text-sm flex gap-1 overflow-auto">
              {exam?.description || "No description available"}
            </p>
          </div>
          {/* start button when hover */}
          <div className="absolute z-10 right-0 bottom-2 bg-blue-600 text-white px-5 py-2.5 font-semibold text-sm flex items-center gap-2 transform translate-x-full group-hover:-translate-x-2 transition-transform duration-300 ease-in-out shadow-md">
            <span>START</span>
            <ArrowRight size={16} />
          </div>
        </Link>
      ))}
      <p className="mt-4 p-2 text-gray-600 text-center">End of list</p>
    </section>
  );
}
