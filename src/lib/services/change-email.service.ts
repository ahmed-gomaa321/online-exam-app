"use server";

import { ChangeEmailFields } from "../types/account-settings-types/edit-profile";
import { getDecodedToken } from "./get-token.service";

export async function changeEmailVerify(data: ChangeEmailFields) {
  const token = await getDecodedToken();
  const res = await fetch(`${process.env.NEXT_API_BASE}/users/email/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Failed to change password";

    const errData = await res.json();
    errorMessage = errData.message || errorMessage;

    throw new Error(errorMessage || "Failed to change your email");
  }

  return res.json();
}
