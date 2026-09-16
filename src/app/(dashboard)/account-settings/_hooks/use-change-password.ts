"use client";
import { changePassword } from "@/lib/services/change-password.service";
import {
  ChangePasswordFiels
} from "@/lib/types/account-settings-types/change-password";
import { useMutation } from "@tanstack/react-query";

export default function useChangePassword() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: ChangePasswordFiels) => {
      const res = await changePassword(data);
      if (res?.status === "false") {
        throw new Error(
          res?.error || "change password failed, please try again.",
        );
      }
      return res;
    },
  });
  return { isPending, error, changePassword: mutate };
}
