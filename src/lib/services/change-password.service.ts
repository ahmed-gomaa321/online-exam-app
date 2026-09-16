"use server";

import { ChangePasswordFiels } from "../types/account-settings-types/change-password";
import { getDecodedToken } from "./get-token.service";

export async function changePassword(data: ChangePasswordFiels) {
  const token = await getDecodedToken();
  const res = await fetch(
    `${process.env.NEXT_API_BASE}/users/change-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    let errorMessage = "Failed to change password";

    const errData = await res.json();
    errorMessage = errData.message || errorMessage;

    throw new Error(errorMessage || "Failed to change password");
  }

  return res.json();
}
