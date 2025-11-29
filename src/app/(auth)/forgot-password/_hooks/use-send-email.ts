"use client";

import sendEmail from "@/lib/_actions/auth-services/forgot-password.service";
import { ForgotPasswordFields } from "@/lib/types/auth-types/forgot-password";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useSendEmail() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (email: ForgotPasswordFields) => {
      const res = await sendEmail(email);
      if ("code" in res) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      toast.success("OTP sent to your email");
    },
  });
  return { isPending, error, sendEmail: mutate };
}
