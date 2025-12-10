import Loading from "@/app/loading";
import { ExamResult } from "@/lib/types/questions-results";
import React, { useEffect, useState } from "react";
import { Chart } from "./chart";

type ResultProps = {
  result?: ExamResult;
};

export default function Result({ result }: ResultProps) {
  const [examResults, setExamResults] = useState<ExamResult | null>(null);

  useEffect(() => {
    if (result) return setExamResults(result);
  }, []);

  if (!examResults) return Loading();

  return (
    <section>
      <p className="font-semibold md:text-2xl text-blue-600">Results:</p>
      <div className="grid grid-cols-1 xl:grid-cols-4 items-center mt-4">
        {/* chart */}
        <div className="col-span-1 flex flex-col items-center gap-3 xl:gap-6 mb-4 xl:mb-0">
          <div className="w-full">
            <Chart />
          </div>
          <div>
            <p className="flex items-center gap-3">
              <span className="size-4 bg-emerald-500"></span>
              <span className="font-medium text-sm">
                Correct: {examResults?.correct}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="size-4 bg-red-500"></span>
              <span className="font-medium text-sm">
                Incorrect: {examResults?.wrong}
              </span>
            </p>
          </div>
        </div>

        {/* questions */}
        <div className="col-span-1 xl:col-span-3 p-4 border border-gray-100">
          {examResults?.WrongQuestions &&
          examResults?.WrongQuestions.length > 0 ? (
            <div
              className={`flex flex-col gap-4 overflow-auto ${
                examResults?.WrongQuestions.length > 3 ? "h-[514px]" : ""
              } pe-2`}
            >
              {examResults?.WrongQuestions.map((q) => (
                <React.Fragment key={q.QID}>
                  <p className="font-semibold md:text-xl text-blue-600">
                    {q.Question}
                  </p>

                  <div className="p-4 flex items-center gap-2 border bg-red-50 text-sm">
                    <span className="w-4 h-4 rounded-full border border-red-600 relative">
                      <span className="w-3 h-3 bg-red-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                    </span>
                    <span>{q.inCorrectAnswer}</span>
                  </div>

                  <div className="p-4 flex items-center gap-2 border bg-emerald-50 text-sm">
                    <span className="w-4 h-4 rounded-full border border-emerald-600 relative"></span>
                    <span>{q.correctAnswer}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="bg-emerald-50 text-emerald-500 w-full">
              Well Done, No Wrong Answer
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
