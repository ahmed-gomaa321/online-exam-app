"use client";
import { changePassword } from "@/lib/services/change-password.service";
import { changePasswordFiels } from "@/lib/types/account-settings-types/change-password";
import { useMutation } from "@tanstack/react-query";

export default function useChangePassword() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: changePasswordFiels) => {
      const res = await changePassword(data);
      if ("code" in res) {
        throw new Error(res.message);
      }
      return res;
    },
  });
  return { isPending, error, changePassword: mutate };
}
