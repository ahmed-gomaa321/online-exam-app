"use client";

import { resetPassword } from "@/lib/_actions/auth-services/forgot-password.service";
import { ResetPasswordFields } from "@/lib/types/auth-types/forgot-password";
import { useMutation } from "@tanstack/react-query";

export default function useResetPassword() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: ResetPasswordFields) => {
      const res = await resetPassword(data);
      if ("code" in res) {
        throw new Error(res.message);
      }
      return res;
    },
  });
  return { isPending, error, resetPassword: mutate };
}
