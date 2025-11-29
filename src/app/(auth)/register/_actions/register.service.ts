"use server";
import { RegisterPayload } from "@/lib/types/auth";
import { RegisterFields } from "@/lib/types/auth-types/register";

export default async function RegisterService(data: RegisterFields) {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload: ApiResponse<RegisterPayload> = await res.json();

  return payload;
}
