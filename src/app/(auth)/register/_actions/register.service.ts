"use server";

import {
  confirmVerifyEmailData,
  verifyEmailData,
} from "@/lib/schemes/auth.schemes";
import { RegisterPayload } from "@/lib/types/auth";
import {
  RegisterFields,
  VerifyEmailPayload,
} from "@/lib/types/auth-types/register";

//step 1: email verification service

export async function emailVerificationService(
  data: verifyEmailData,
): Promise<ApiResponse<VerifyEmailPayload>> {
  const res = await fetch(
    `${process.env.NEXT_API_BASE}/auth/send-email-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const payload = await res.json();
  return payload;
}

//  step 2: confirm email verification code service
export async function confirmEmailVerification(data: confirmVerifyEmailData) {
  const res = await fetch(
    `${process.env.NEXT_API_BASE}/auth/confirm-email-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const payload = await res.json();
  return payload;
}

// register service
export default async function RegisterService(
  data: RegisterFields,
): Promise<ApiResponse<RegisterPayload>> {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload: ApiResponse<RegisterPayload> = await res.json();

  return payload;
}
