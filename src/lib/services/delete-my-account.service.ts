"use server";

import { getDecodedToken } from "./get-token.service";

export async function deleteMyAccount() {
  const token = await getDecodedToken();
  const res = await fetch(`${process.env.NEXT_API_BASE}/users/account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMsg = "Failed to delete account";

    const errData = await res.json();
    errorMsg = errData.message || errorMsg;

    throw new Error(errorMsg || "Failed to delete account");
  }

  return res.json();
}
