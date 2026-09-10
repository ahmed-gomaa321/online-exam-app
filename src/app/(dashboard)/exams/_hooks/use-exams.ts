"use client";

import { getExams } from "@/lib/services/exams.service";
import { DiplomaDetailsPayload } from "@/lib/types/exams";
import { useQuery } from "@tanstack/react-query";

export default function useExams(id: string) {
  return useQuery<ApiResponse<DiplomaDetailsPayload>, Error>({
    queryKey: ["exams", id],
    queryFn: () => getExams(id),
  });
}
