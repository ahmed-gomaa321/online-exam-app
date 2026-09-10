import { DiplomasPayload } from "@/lib/types/diplomas";

interface DiplomasParams {
  pageParam?: number | unknown;
}
export async function getDiplomas({
  pageParam = 1,
}: DiplomasParams): Promise<ApiResponse<DiplomasPayload>> {
  const res = await fetch(`/api/diplomas?page=${pageParam}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let errorMessage = "Failed to fetch diplomas";

    const errorData = await res.json();
    errorMessage = errorData.message || errorMessage;

    throw new Error(errorMessage);
  }
  const data: ApiResponse<DiplomasPayload> = await res.json();
  return data;
}
