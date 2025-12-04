import { ProfileFormFields } from "../types/account-settings-types/edit-profile";

export async function editProfile(data: ProfileFormFields) {
  const res = await fetch("/api/edit-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Failed to update profile";

    const errData = await res.json();
    errorMessage = errData.message || errorMessage;

    throw new Error(errorMessage || "Failed to update profile");
  }

  return res.json();
}
