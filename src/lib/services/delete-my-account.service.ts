export async function deleteMyAccount() {
  const res = await fetch("/api/delete-my-account", { method: "DELETE" });

  if (!res.ok) {
    let errorMsg = "Failed to delete account";

    const errData = await res.json();
    errorMsg = errData.message || errorMsg;

    throw new Error(errorMsg || "Failed to delete account");
  }

  return res.json();
}
