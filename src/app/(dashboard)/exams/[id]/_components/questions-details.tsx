"use client";

import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";
import { useContext, useEffect, useState } from "react";
import useQuestions from "../../_hooks/use-questions";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserAnswer } from "@/lib/types/questions";
import { formatTime } from "../../_utils/formate-time";
import { getRemainingTime } from "../../_utils/exam-time";

export default function QuestionsDetails({ examId }: { examId: string }) {
  //   hooks
  const { examName } = useContext(ExamNameContext);
  const [diplomaTitle, setDiplomaTitle] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const { data: questions, isLoading, error } = useQuestions(examId);

  const totalQuestions = questions?.questions.length ?? 0;

  //   Set diploma title from local storage
  useEffect(() => {
    const title = localStorage.getItem("diploma-title");
    if (title) setDiplomaTitle(title);
  }, []);

  //   Calculate progress
  const progress = totalQuestions
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100
    : 0;

  //   Select answer
  const currentQuestion = questions?.questions[currentQuestionIndex] ?? null;
  const handleSelectAnswer = (answerKey: string) => {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const exists = prev.find(
        (answer) => answer.questionId === currentQuestion._id
      );

      if (exists) {
        return prev.map((answer) =>
          answer.questionId === currentQuestion._id
            ? { ...answer, correct: answerKey }
            : answer
        );
      }

      return [...prev, { questionId: currentQuestion._id, correct: answerKey }];
    });
  };

  //   navigation functions
  const currentExam =
    questions?.questions?.[currentQuestionIndex]?.exam?.title ?? null;
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1)
      setCurrentQuestionIndex((p) => {
        const nextIndex = p + 1;
        localStorage.setItem(`exam-${currentExam}`, nextIndex.toString());
        return nextIndex;
      });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex((p) => {
        const prevIndex = p - 1;
        localStorage.setItem(`exam-${currentExam}`, prevIndex.toString());
        return prevIndex;
      });
  };

  //   Timer interval
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((p) => {
        localStorage.setItem(`time-${currentExam}`, (p - 1).toString());
        localStorage.setItem(
          `time-startTime-${currentExam}`,
          Date.now().toString()
        );
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  //   finish questions
  const handleFinish = () => {
    if (!questions) return;
    const duration = questions.questions[0]?.exam.duration ?? 0;
    const totalSeconds = duration * 60;
    const spentSeconds = totalSeconds - timeLeft;
    const spentMinutes = Math.floor(spentSeconds / 60);

    const payload = {
      answers,
      time: spentMinutes,
    };

    // todo send request to bake end
    console.log("Submitting exam:", payload);
  };

  //   Set exam duration
  useEffect(() => {
    const savedTime = localStorage.getItem(`time-${currentExam}`);
    if (questions?.questions.length && !savedTime) {
      const duration = questions?.questions[0]?.exam.duration ?? 0;
      setTimeLeft(duration * 60);
    }
  }, [questions, timeLeft]);

  //   Handle auto finish
  useEffect(() => {
    if (timeLeft === 0 && questions) handleFinish();
    // todo navigate to result
  }, [timeLeft, questions]);

  //   get current question and saved time index from local storage
  useEffect(() => {
    // question index
    const savedQuestionIndex = localStorage.getItem(`exam-${currentExam}`);
    if (savedQuestionIndex) {
      setCurrentQuestionIndex(parseInt(savedQuestionIndex));
    }
    // time
    const savedTime = localStorage.getItem(`time-${currentExam}`);
    const savedtartTime = localStorage.getItem(`time-startTime-${currentExam}`);
    if (savedTime && savedtartTime) {
      const remainingTime = getRemainingTime({ savedTime, savedtartTime });
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    }
  }, [currentExam]);

  //   progress degre
  const durationSeconds = questions?.questions?.[0]?.exam?.duration
    ? questions.questions[0].exam.duration * 60
    : 1;

  const progressDeg = ((durationSeconds - timeLeft) / durationSeconds) * 360;

  if (isLoading) return <Loading />;
  if (error)
    return <p className="bg-red-50 p-4 text-red-500">Error: {error.message}</p>;
  if (!questions?.questions.length)
    return (
      <p className="bg-gray-100 text-gray-500 p-4 w-full text-center">
        No questions found.
      </p>
    );

  return (
    <section className="bg-white p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
        <div>
          {diplomaTitle && diplomaTitle} - {examName && examName}
        </div>
        <div className="flex gap-2 items-center">
          Question
          <span className="text-blue-600 font-bold">
            {currentQuestionIndex + 1}
          </span>
          of {totalQuestions}
        </div>
      </div>

      {/* Progress */}
      <div className="h-4 bg-gray-200">
        <div
          className="h-4 bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="flex flex-col gap-4">
        <p className="font-semibold md:text-2xl text-blue-600">
          {currentQuestion?.question}
        </p>

        <div className="flex flex-col gap-2">
          {currentQuestion?.answers.map((a) => {
            const selected =
              answers.find(
                (answer) => answer.questionId === currentQuestion._id
              )?.correct === a.key;

            return (
              <button
                key={a.answer}
                className={`p-4 text-left flex items-center gap-2 border transition-colors ${
                  selected
                    ? "bg-blue-100 border-blue-600"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
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
                <span className="text-gray-800">{a.answer}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* back Navigation */}
      <div className="grid grid-cols-10 xl:grid-cols-11 items-center gap-2">
        <Button
          variant={"secondary"}
          className="col-span-4 xl:col-span-5"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft /> Previous
        </Button>

        {/* Timer */}
        <div className="col-span-2 xl:col-span-1 flex justify-center items-center">
          <div
            className="relative w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] rounded-full flex justify-center items-center"
            style={{
              background: `conic-gradient(#e0f2fe ${progressDeg}deg, #2563eb 0deg)`,
            }}
          >
            <div className="w-[40px] h-[40px] xl:w-[40px] xl:h-[40px] rounded-full bg-white flex justify-center items-center">
              <span className="font-bold text-blue-600 text-xs">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        {/* next navigation */}
        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button className="col-span-4 xl:col-span-5" onClick={handleFinish}>
            Finish
          </Button>
        ) : (
          <Button className="col-span-4 xl:col-span-5" onClick={handleNext}>
            Next <ChevronRight />
          </Button>
        )}
      </div>
    </section>
  );
}
