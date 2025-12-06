import { ExamsResponse } from "../types/exams";

export async function getExams(): Promise<ExamsResponse> {
  const res = await fetch(`/api/exams`);

  if (!res.ok) {
    let errorMessage = "Failed to fetch exams";

    const errorData = await res.json();
    errorMessage = errorData.message || errorMessage;

    throw new Error(errorMessage);
  }
  const data = await res.json();
  return data;
}
