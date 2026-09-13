"use client";

import { getQuestions } from "@/lib/services/questions.service";
import { QuestionsPayload } from "@/lib/types/questions";
import { useQuery } from "@tanstack/react-query";

export default function useQuestions(examId: string) {
  return useQuery<ApiResponse<QuestionsPayload>, Error>({
    queryKey: ["questions", examId],
    queryFn: () => getQuestions(examId),
    enabled: !!examId,
  });
}
