"use client";

import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";
import { useContext, useEffect, useState } from "react";
import useQuestions from "../../_hooks/use-questions";
import useQuestionsResults from "../../_hooks/use-questions-results";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FolderSearch,
  RotateCcw,
} from "lucide-react";
import { UserAnswer } from "@/lib/types/questions";
import { formatTime } from "../../_utils/formate-time";
import { getRemainingTime } from "../../_utils/exam-time";
import { toast } from "sonner";
import Result from "./result";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default function QuestionsDetails({ examId }: { examId: string }) {
  const router = useRouter();
  const { examName } = useContext(ExamNameContext);

  const { data: questions, isLoading, error } = useQuestions(examId);
  const { data: results, isPending, submitExam } = useQuestionsResults();

  const [diplomaTitle, setDiplomaTitle] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); 

  const totalQuestions = questions?.questions.length ?? 0;
  const currentQuestion = questions?.questions[currentQuestionIndex] ?? null;
  const currentExam = currentQuestion?.exam?.title ?? null;

  // Load diploma title
  useEffect(() => {
    const title = localStorage.getItem("diploma-title");
    if (title) setDiplomaTitle(title);
  }, []);

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
    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex));

    const durationMinutes = questions?.questions[0].exam.duration ?? 0;
    const totalSeconds = durationMinutes * 60;

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
  }, [currentExam, totalQuestions]);

  // Timer countdown
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isFinished]);

  // Auto-finish when time = 0
  useEffect(() => {
    if (timeLeft === 0 && !isFinished && totalQuestions > 0 && !isInitialLoad) {
      handleFinish();
    }
  }, [timeLeft, isFinished, totalQuestions, isInitialLoad]);

  // Handle answer selection
  const handleSelectAnswer = (answerKey: string) => {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const exist = prev.find((a) => a.questionId === currentQuestion._id);
      const updatedAnswers = exist
        ? prev.map((a) =>
            a.questionId === currentQuestion._id
              ? { ...a, correct: answerKey }
              : a
          )
        : [...prev, { questionId: currentQuestion._id, correct: answerKey }];

      localStorage.setItem(
        `exam-answers-${currentExam}`,
        JSON.stringify(updatedAnswers)
      );
      return updatedAnswers;
    });
  };

  // Navigation
  const handleNext = () => {
    if (!currentExam || currentQuestionIndex >= totalQuestions - 1) return;
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

  // Finish exam
  const handleFinish = () => {
    if (!questions || isFinished) return;

    const duration = questions.questions[0].exam.duration ?? 0;
    const totalSeconds = duration * 60;
    const spentSeconds = totalSeconds - timeLeft;
    const spentMinutes = Math.floor(spentSeconds / 60);

    const finalAnswers = questions.questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q._id);
      return {
        questionId: q._id,
        correct: userAnswer?.correct ?? "not answered",
      };
    });

    submitExam(
      { answers: finalAnswers, time: spentMinutes },
      {
        onSuccess: (res) => {
          localStorage.setItem("exam-results", JSON.stringify(res));
          toast.success("Submitted successfully");
          localStorage.setItem(`exam-finished-${currentExam}`, "true");
          setIsFinished(true);
        },
        onError: (err) => {
          localStorage.removeItem(`exam-finished-${currentExam}`);
          setIsFinished(false);
          toast.error(err.message);
        },
      }
    );
  };

  // Restart exam
  const handleRestart = () => {
    if (!currentExam) return;

    localStorage.removeItem(`exam-finished-${currentExam}`);
    localStorage.removeItem(`exam-${currentExam}`);
    localStorage.removeItem(`exam-answers-${currentExam}`);

    const duration = questions?.questions[0].exam.duration ?? 0;
    const now = Date.now();
    localStorage.setItem(`time-startTime-${currentExam}`, now.toString());
    setTimeLeft(duration * 60);

    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsInitialLoad(true);
  };

  const handleExplore = () => router.replace(ROUTES.EXAMS);

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!questions?.questions.length) return <p>No questions found.</p>;

  const progress = totalQuestions
    ? ((isFinished ? totalQuestions : currentQuestionIndex + 1) /
        totalQuestions) *
      100
    : 0;

  const durationSeconds = questions.questions[0].exam.duration * 60;
  const progressDeg = ((durationSeconds - timeLeft) / durationSeconds) * 360;

  return (
    <section className="bg-white p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between text-gray-500 text-xs md:text-sm">
        <div>
          {diplomaTitle} - {examName}
        </div>
        <div className="flex items-center gap-1">
          Question
          <span className="font-bold text-sm text-blue-600">
            {isFinished || results ? totalQuestions : currentQuestionIndex + 1}
          </span>
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

      {/* Question */}
      {!isFinished ? (
        <section>
          <p className="font-semibold md:text-2xl text-blue-600">
            {currentQuestion?.question}
          </p>
          <div className="flex flex-col gap-2 mt-4 xl:mt-0">
            {currentQuestion?.answers.map((a) => {
              const selected =
                answers.find((ans) => ans.questionId === currentQuestion?._id)
                  ?.correct === a.key;
              return (
                <button
                  key={a.key}
                  className="p-4 flex gap-2 border bg-gray-50 hover:bg-gray-100"
                  onClick={() => handleSelectAnswer(a.key)}
                >
                  <span
                    className={`w-4 h-4 rounded-full border relative ${
                      selected ? "border-blue-600" : "border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="w-3 h-3 bg-blue-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                    )}
                  </span>
                  <span>{a.answer}</span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <Result
          result={
            results ||
            JSON.parse(localStorage.getItem("exam-results") || "null")
          }
        />
      )}

      {/* Navigation & Timer */}
      <div
        className={`grid ${
          isFinished ? "grid-cols-12" : "grid-cols-10 xl:grid-cols-11"
        } gap-2 items-center`}
      >
        <Button
          variant="secondary"
          className={`${
            isFinished
              ? "col-span-12 xl:col-span-6"
              : "col-span-4 xl:col-span-5"
          }`}
          disabled={isFinished ? false : currentQuestionIndex === 0}
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

        <div
          className={`col-span-2 xl:col-span-1 flex justify-center ${
            isFinished ? "hidden" : ""
          }`}
        >
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

        <Button
          className={`${
            isFinished
              ? "col-span-12 xl:col-span-6"
              : "col-span-4 xl:col-span-5"
          }`}
          onClick={
            isFinished
              ? handleExplore
              : currentQuestionIndex === totalQuestions - 1
              ? handleFinish
              : handleNext
          }
          disabled={isPending}
        >
          {isFinished ? (
            <>
              Explore <FolderSearch size={18} />
            </>
          ) : currentQuestionIndex === totalQuestions - 1 ? (
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
