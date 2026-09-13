"use client";

import { submitExam } from "@/lib/_actions/exam-submition.service";
import {
  ExamResultPayload,
  SubmitExamRequest,
} from "@/lib/types/questions-results";
import { useMutation } from "@tanstack/react-query";

export default function useQuestionsResults() {
  const { data, isPending, error, mutate } = useMutation<
    ApiResponse<ExamResultPayload>,
    Error,
    SubmitExamRequest
  >({
    mutationFn: (payload: SubmitExamRequest) => submitExam(payload),
  });

  return { data, isPending, error, submitExam: mutate };
}
