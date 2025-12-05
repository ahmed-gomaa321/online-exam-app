import { changePasswordFiels } from "../types/account-settings-types/change-password";

export async function changePassword(data: changePasswordFiels) {
  const res = await fetch("/api/change-password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Failed to change password";

    const errData = await res.json();
    errorMessage = errData.message || errorMessage;

    throw new Error(errorMessage || "Failed to change password");
  }

  return res.json();
}
