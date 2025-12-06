import { DiplomasResponse } from "../types/diplomas";

interface DiplomasParams {
  pageParam?: number | unknown;
}
export async function getDiplomas({
  pageParam = 1,
}: DiplomasParams): Promise<DiplomasResponse> {
  const res = await fetch(`/api/diplomas?page=${pageParam}`);
  if (!res.ok) {
    let errorMessage = "Failed to fetch diplomas";

    const errorData = await res.json();
    errorMessage = errorData.message || errorMessage;

    throw new Error(errorMessage);
  }
  const data = await res.json();
  return data;
}
