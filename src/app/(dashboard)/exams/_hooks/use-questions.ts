"use client";

import { getQuestions } from "@/lib/services/questions.service";
import { QuestionsResponse } from "@/lib/types/questions";
import { useQuery } from "@tanstack/react-query";

export default function useQuestions(examId: string) {
  return useQuery<QuestionsResponse, Error>({
    queryKey: ["questions", examId],
    queryFn: () => getQuestions(examId),
    enabled: !!examId,
  });
}
