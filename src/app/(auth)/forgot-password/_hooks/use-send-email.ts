"use client";

import sendEmail from "@/lib/_actions/auth-services/forgot-password.service";
import { ForgotPasswordFields } from "@/lib/types/auth-types/forgot-password";
import { useMutation } from "@tanstack/react-query";

export default function useSendEmail() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (email: ForgotPasswordFields) => {
      const res = await sendEmail(email);
      if (res?.status === false) {
        throw new Error(res.message);
      }
      return res;
    },
  });
  return { isPending, error, sendEmail: mutate };
}
