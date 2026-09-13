"use client";

import Loading from "@/app/loading";
import React, { useEffect, useState } from "react";
import { Chart } from "./chart";
import { ExamResultPayload } from "@/lib/types/questions-results";

type ResultProps = {
  result?: ExamResultPayload | any | null;
  examId?: string;
};

export default function Result({ result, examId }: ResultProps) {
  const [data, setData] = useState<any>(result ?? null);

  useEffect(() => {
    if (!result && typeof window !== "undefined") {
      const targetExamId = examId || result?.payload?.submission?.examId;
      const key = targetExamId
        ? `exam-results-${targetExamId}`
        : "exam-results";
      const cached = localStorage.getItem(key);

      if (cached) {
        try {
          setData(JSON.parse(cached));
        } catch (e) {
          console.error("Failed to parse cached exam results", e);
        }
      }
    } else if (result) {
      setData(result);
    }
  }, [result, examId]);

  if (!data) return <Loading />;

  const payload = data?.payload ?? data;
  const submission = payload?.submission;
  const analytics = payload?.analytics ?? [];

  const wrongCount = submission?.wrongAnswers ?? 0;
  const correctCount = submission?.correctAnswers ?? 0;

  return (
    <section>
      <p className="font-semibold md:text-2xl text-blue-600">Results:</p>
      <div className="grid grid-cols-1 gap-1 xl:grid-cols-4 items-center mt-4">
        {/* Chart Section */}
        <div className="col-span-1 h-full flex flex-col items-center justify-center gap-3 xl:gap-6 mb-4 xl:mb-0 bg-blue-50 border border-blue-200">
          <div className="w-full">
            <Chart correct={correctCount} wrong={wrongCount} />
          </div>
          <div>
            <p className="flex items-center gap-3">
              <span className="size-4 bg-emerald-500 rounded-sm"></span>
              <span className="font-medium text-sm">
                Correct: {correctCount}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="size-4 bg-red-500 rounded-sm"></span>
              <span className="font-medium text-sm">
                Incorrect: {wrongCount}
              </span>
            </p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="border border-dashed border-blue-200 col-span-1 xl:col-span-3 p-4">
          {wrongCount > 0 ? (
            <div
              className={`flex flex-col gap-4 overflow-auto ${
                wrongCount > 3 ? "h-[514px]" : ""
              } pe-2`}
            >
              {analytics.map((q: any) => (
                <React.Fragment key={q.questionId}>
                  <p className="font-semibold md:text-xl text-blue-600">
                    {q.questionText}
                  </p>

                  <div className="p-4 flex items-center gap-2 border bg-red-50 text-sm rounded">
                    <span className="w-4 h-4 rounded-full border border-red-600 relative flex-shrink-0">
                      <span className="w-3 h-3 bg-red-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                    </span>
                    <span>
                      {q?.selectedAnswer?.text ?? "No answer selected"}
                    </span>
                  </div>

                  <div className="p-4 flex items-center gap-2 border bg-emerald-50 text-sm rounded">
                    <span className="w-4 h-4 rounded-full border border-emerald-600 relative flex-shrink-0"></span>
                    <span>{q?.correctAnswer?.text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 text-emerald-600 p-4 text-center rounded font-semibold">
              Well Done, No Wrong Answers! 🎉
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
