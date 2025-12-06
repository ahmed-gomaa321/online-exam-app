"use client";

import { getExams } from "@/lib/services/exams.service";
import { ExamsResponse } from "@/lib/types/exams";
import { useQuery } from "@tanstack/react-query";

export default function useExams() {
  return useQuery<ExamsResponse, Error>({
    queryKey: ["exams"],
    queryFn: () => getExams(),
  });
}
