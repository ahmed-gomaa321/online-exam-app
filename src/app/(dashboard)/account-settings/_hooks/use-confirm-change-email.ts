"use client";
import { confirmChangeEmailVerify } from "@/lib/services/confirm-change-email.service";
import { ConfirmChangeEmailFields } from "@/lib/types/account-settings-types/edit-profile";
import { useMutation } from "@tanstack/react-query";

export default function useConfirmChangeEmail() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: ConfirmChangeEmailFields) => {
      const res = await confirmChangeEmailVerify(data);
      if (res?.status === "false") {
        throw new Error(res.message);
      }

      return res;
    },
  });

  return { isPending, error, confirmChangeEmail: mutate };
}
