import { QuestionsPayload } from "../types/questions";

export async function getQuestions(
  examId: string,
): Promise<ApiResponse<QuestionsPayload>> {
  if (!examId || examId === "undefined") {
    throw new Error("Invalid exam ID provided");
  }

  const res = await fetch("/api/questions/" + examId);

  if (!res.ok) {
    let errorMessage = "Failed to fetch questions";

    const errData = await res.json();
    errorMessage = errData.message || errorMessage;

    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}
