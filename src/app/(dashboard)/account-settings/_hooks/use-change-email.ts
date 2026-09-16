"use client";
import { changeEmailVerify } from "@/lib/services/change-email.service";
import { ChangeEmailFields } from "@/lib/types/account-settings-types/edit-profile";
import { useMutation } from "@tanstack/react-query";

export default function useChangeEmail() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: ChangeEmailFields) => {
      const res = await changeEmailVerify(data);
      if (res?.status === false || res?.status === "false") {
        throw new Error(res.message);
      }

      return res;
    },
  });

  return { isPending, error, changeEmail: mutate };
}
