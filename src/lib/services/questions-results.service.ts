import { ExamResult, SubmitExamRequest } from "../types/questions-results";

export async function submitExam(data: SubmitExamRequest): Promise<ExamResult> {
  const res = await fetch("/api/questions-results", {
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
