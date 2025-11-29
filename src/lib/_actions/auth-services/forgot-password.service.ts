"use server";
import {
  ForgotPasswordFields,
  ResetPasswordFields,
  VerifyOtpFields,
} from "@/lib/types/auth-types/forgot-password";

// send email
export default async function sendEmail(data: ForgotPasswordFields) {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/forgotPassword`, {
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

// verify otp
export async function verifyOtp(data: VerifyOtpFields) {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/verifyResetCode`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  return payload;
}

// reset password
export async function resetPassword(data: ResetPasswordFields) {
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/resetPassword`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  return payload;
}
