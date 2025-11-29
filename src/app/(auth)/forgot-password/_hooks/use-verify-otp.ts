"use client";
import { verifyOtp } from "@/lib/_actions/auth-services/forgot-password.service";
import { VerifyOtpFields } from "@/lib/types/auth-types/forgot-password";
import { useMutation } from "@tanstack/react-query";

export default function useVerifyOtp() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (resetCode: VerifyOtpFields) => {
      const res = await verifyOtp(resetCode);
      if ("code" in res) {
        throw new Error(res.message);
      }
      return res;
    },
  });
  return { isPending, error, verifyOtp: mutate };
}
