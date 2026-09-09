"use server";
import {
  ForgotPasswordFields,
  ResetPasswordFields,
  SendEmailResponse,
} from "@/lib/types/auth-types/forgot-password";

// send email
export default async function sendEmail(
  data: ForgotPasswordFields,
): Promise<ApiResponse<SendEmailResponse>> {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to send email: ${res.status} - ${text}`);
  }
  const payload = await res.json();
  return payload;
}

// reset password
export async function resetPassword(data: ResetPasswordFields) {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to reset password: ${res.status} - ${text}`);
  }
  const payload = await res.json();
  return payload;
}
