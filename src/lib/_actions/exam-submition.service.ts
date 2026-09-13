"use server";

import { getDecodedToken } from "../services/get-token.service";
import {
  ExamResultPayload,
  SubmitExamRequest,
} from "../types/questions-results";

export async function submitExam(
  data: SubmitExamRequest,
): Promise<ApiResponse<ExamResultPayload>> {
  const token = await getDecodedToken();
  const res = await fetch(`${process.env.NEXT_API_BASE}/submissions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Failed to fetch questions";

    const errData = await res.json();
    errorMessage = errData.message || errorMessage;

    throw new Error(errorMessage);
  }

  const payload = await res.json();
  return payload;
}
