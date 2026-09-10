import { DiplomaDetailsPayload } from "../types/exams";

export async function getExams(
  id: string,
): Promise<ApiResponse<DiplomaDetailsPayload>> {
  if (!id || id === "undefined") {
    throw new Error("Invalid diploma ID provided");
  }

  const res = await fetch("/api/diplomas/" + id);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch exams");
  }

  return data;
}
