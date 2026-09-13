"use client";

import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";
import { useContext, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FolderSearch,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import Result from "./result";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import useQuestions from "../../../_hooks/use-questions";
import useQuestionsResults from "../../../_hooks/use-questions-results";
import { getRemainingTime } from "../../../_utils/exam-time";
import { formatTime } from "../../../_utils/formate-time";
import useExams from "../../../_hooks/use-exams";

interface AnswerState {
  questionId: string;
  answerId: string;
}

export default function QuestionsDetails({ examId }: { examId: string }) {
  const router = useRouter();
  const { examName } = useContext(ExamNameContext);

  const { data: questions, isLoading, error } = useQuestions(examId);
  const { data: results, isPending, submitExam } = useQuestionsResults();
  const { data: getExamInfo } = useExams(examId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [savedResult, setSavedResult] = useState<any>(null);

  const totalQuestions =
    (questions && questions?.status && questions?.payload?.questions?.length) ??
    0;
  const currentQuestion =
    (questions &&
      questions?.status &&
      questions?.payload?.questions?.[currentQuestionIndex]) ??
    null;
  const currentExam = examName ?? null;

  const diplomaTitle =
    (getExamInfo &&
      getExamInfo?.status &&
      getExamInfo?.payload?.diploma?.title) ||
    (typeof window !== "undefined"
      ? localStorage.getItem("diploma-title")
      : "") ||
    "";

  // Load initial saved results from localStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedRes = localStorage.getItem(`exam-results-${examId}`);
      if (cachedRes) {
        try {
          setSavedResult(JSON.parse(cachedRes));
        } catch {
          setSavedResult(null);
        }
      }
    }
  }, [examId, isFinished]);

  // Restore exam state
  useEffect(() => {
    if (!currentExam || totalQuestions === 0) return;

    const finished =
      localStorage.getItem(`exam-finished-${currentExam}`) === "true";
    setIsFinished(finished);

    if (finished) {
      setTimeLeft(0);
      setIsInitialLoad(false);
      return;
    }

    const savedAnswers = localStorage.getItem(`exam-answers-${currentExam}`);
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch {
        setAnswers([]);
      }
    }

    const savedIndex = localStorage.getItem(`exam-${currentExam}`);
    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex, 10));

    const savedDuration =
      localStorage.getItem(`exam-duration-${examId}`) ?? "0";
    const totalSeconds = Number(savedDuration) * 60;
    setTotalDurationSeconds(totalSeconds);

    let savedStart = localStorage.getItem(`time-startTime-${currentExam}`);
    if (!savedStart) {
      savedStart = Date.now().toString();
      localStorage.setItem(`time-startTime-${currentExam}`, savedStart);
    }

    const rem = getRemainingTime({
      duration: totalSeconds,
      startTime: savedStart,
    });
    setTimeLeft(rem > 0 ? rem : 0);
    setIsInitialLoad(false);
  }, [currentExam, totalQuestions, examId]);

  // Timer countdown
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isFinished]);

  // Auto-finish when time reaches 0
  useEffect(() => {
    if (
      timeLeft === 0 &&
      !isFinished &&
      +totalQuestions > 0 &&
      !isInitialLoad
    ) {
      handleFinish();
    }
  }, [timeLeft, isFinished, totalQuestions, isInitialLoad]);

  const handleSelectAnswer = (answerId: string) => {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const exist = prev.find((a) => a.questionId === currentQuestion.id);
      const updatedAnswers = exist
        ? prev.map((a) =>
            a.questionId === currentQuestion.id ? { ...a, answerId } : a,
          )
        : [...prev, { questionId: currentQuestion.id, answerId }];

      localStorage.setItem(
        `exam-answers-${currentExam}`,
        JSON.stringify(updatedAnswers),
      );
      return updatedAnswers;
    });
  };

  const handleNext = () => {
    if (!currentExam || currentQuestionIndex >= +totalQuestions - 1) return;
    const next = currentQuestionIndex + 1;
    setCurrentQuestionIndex(next);
    localStorage.setItem(`exam-${currentExam}`, next.toString());
  };

  const handlePrevious = () => {
    if (!currentExam || currentQuestionIndex <= 0) return;
    const prev = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prev);
    localStorage.setItem(`exam-${currentExam}`, prev.toString());
  };

  const handleFinish = () => {
    if (!questions || isFinished) return;

    const savedStart = localStorage.getItem(`time-startTime-${currentExam}`);
    const startedAt = savedStart
      ? new Date(Number(savedStart)).toISOString()
      : new Date().toISOString();

    // Load fresh answers from storage to prevent stale state issues
    const rawAnswers = localStorage.getItem(`exam-answers-${currentExam}`);
    const currentAnswersState: AnswerState[] = rawAnswers
      ? JSON.parse(rawAnswers)
      : answers;

    const finalAnswers = currentAnswersState
      .filter((ans) => ans.answerId)
      .map((ans) => ({
        questionId: ans.questionId,
        answerId: ans.answerId,
      }));

    submitExam(
      { examId, answers: finalAnswers, startedAt },
      {
        onSuccess: (res) => {
          localStorage.setItem(`exam-results-${examId}`, JSON.stringify(res));
          localStorage.setItem(`exam-finished-${currentExam}`, "true");
          setSavedResult(res);
          setIsFinished(true);
          toast.success("Submitted successfully");
        },
        onError: (err) => {
          localStorage.removeItem(`exam-finished-${currentExam}`);
          setIsFinished(false);
          toast.error(err.message);
        },
      },
    );
  };

  const handleRestart = () => {
    if (!currentExam) return;
    localStorage.removeItem(`exam-results-${examId}`);
    localStorage.removeItem(`exam-finished-${currentExam}`);
    localStorage.removeItem(`exam-${currentExam}`);
    localStorage.removeItem(`exam-answers-${currentExam}`);

    const now = Date.now();
    localStorage.setItem(`time-startTime-${currentExam}`, now.toString());
    setTimeLeft(totalDurationSeconds);

    setIsFinished(false);
    setSavedResult(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsInitialLoad(true);
  };

  const handleExplore = () =>
    router.replace(ROUTES.EXAMS_DIPLOMA.replace(":id", examId));

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!questions?.status || !questions?.payload?.questions.length)
    return (
      <p className="bg-white p-6 text-gray-800 text-center">
        Sorry, No questions found.
      </p>
    );

  const progress = totalQuestions
    ? ((isFinished ? totalQuestions : currentQuestionIndex + 1) /
        totalQuestions) *
      100
    : 0;

  const progressDeg =
    totalDurationSeconds > 0
      ? ((totalDurationSeconds - timeLeft) / totalDurationSeconds) * 360
      : 0;

  return (
    <section className="bg-white pt-2 px-6 flex flex-col gap-2 mt-0">
      {/* Header */}
      <div className="flex flex-col md:gap-0 md:flex-row md:justify-between text-gray-500 text-xs md:text-sm">
        <div>
          {diplomaTitle} - {examName}
        </div>
        <div className="flex items-center gap-1">
          Question{" "}
          <span className="font-bold text-sm text-blue-600">
            {isFinished ? totalQuestions : currentQuestionIndex + 1}
          </span>{" "}
          of {totalQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-gray-200">
        <div
          className="h-4 bg-blue-600"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content */}
      {!isFinished ? (
        <section className="mt-3 md:mt-4">
          <p className="font-semibold md:text-2xl text-blue-600">
            {currentQuestion && currentQuestion?.text}
          </p>
          <div className="flex flex-col gap-2 mt-4 xl:mt-2">
            {currentQuestion &&
              currentQuestion?.answers.map((a) => {
                const selected =
                  answers.find((ans) => ans.questionId === currentQuestion?.id)
                    ?.answerId === a?.id;
                return (
                  <button
                    key={a.id}
                    className="p-2 xl:p-4 grid grid-cols-12 xl:flex items-center gap-2 border bg-gray-50 hover:bg-gray-100"
                    onClick={() => handleSelectAnswer(a.id)}
                  >
                    <span
                      className={`w-4 h-4 col-span-1 rounded-full border relative ${
                        selected ? "border-blue-600" : "border-gray-300"
                      }`}
                    >
                      {selected && (
                        <span className="w-3 h-3 bg-blue-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                      )}
                    </span>
                    <span className="col-span-11 text-xs xl:text-base overflow-auto text-start">
                      {a?.text}
                    </span>
                  </button>
                );
              })}
          </div>
        </section>
      ) : (
        <Result result={results || savedResult} examId={examId} />
      )}

      {/* Navigation Footer */}
      <div
        className={`grid ${isFinished ? "grid-cols-12" : "grid-cols-10 xl:grid-cols-11"} gap-2 items-center`}
      >
        <Button
          variant="secondary"
          className={
            isFinished
              ? "col-span-12 xl:col-span-6"
              : "col-span-4 xl:col-span-5"
          }
          disabled={!isFinished && currentQuestionIndex === 0}
          onClick={isFinished ? handleRestart : handlePrevious}
        >
          {isFinished ? (
            <>
              <RotateCcw size={18} /> Restart
            </>
          ) : (
            <>
              <ChevronLeft /> Previous
            </>
          )}
        </Button>

        {!isFinished && (
          <div className="col-span-2 xl:col-span-1 flex justify-center">
            <div
              className="relative w-[50px] h-[50px] rounded-full flex justify-center items-center"
              style={{
                background: `conic-gradient(#e0f2fe ${progressDeg}deg, #2563eb 0deg)`,
              }}
            >
              <div className="w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center">
                <span className="text-xs font-bold text-blue-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          className={
            isFinished
              ? "col-span-12 xl:col-span-6"
              : "col-span-4 xl:col-span-5"
          }
          onClick={
            isFinished
              ? handleExplore
              : currentQuestionIndex === +totalQuestions - 1
                ? handleFinish
                : handleNext
          }
          disabled={isPending}
        >
          {isFinished ? (
            <>
              <FolderSearch size={18} /> Explore
            </>
          ) : currentQuestionIndex === +totalQuestions - 1 ? (
            isPending ? (
              "Finishing..."
            ) : (
              "Finish"
            )
          ) : (
            <>
              Next <ChevronRight />
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
