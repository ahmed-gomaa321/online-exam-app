"use server";
import { LoginPayload } from "@/lib/types/auth";
import { LoginFields } from "@/lib/types/auth-types/login";

export default async function LoginService(data: LoginFields) {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload: ApiResponse<LoginPayload> = await res.json();
  return payload;
}
