"use client";

import { submitExam } from "@/lib/services/questions-results.service";
import { ExamResult, SubmitExamRequest } from "@/lib/types/questions-results";
import { useMutation } from "@tanstack/react-query";

export default function useQuestionsResults() {
  const { data, isPending, error, mutate } = useMutation<
    ExamResult,
    Error,
    SubmitExamRequest
  >({
    mutationFn: (payload: SubmitExamRequest) => submitExam(payload),
  });

  return { data, isPending, error, submitExam: mutate };
}
