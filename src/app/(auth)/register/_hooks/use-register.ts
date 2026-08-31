"use client";

import { RegisterFields } from "@/lib/types/auth-types/register";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import RegisterService, {
  confirmEmailVerification,
  emailVerificationService,
} from "../_actions/register.service";
import {
  confirmVerifyEmailData,
  verifyEmailData,
} from "@/lib/schemes/auth.schemes";

// verify email hook
export function useverifyEmail() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: verifyEmailData) => {
      const payload = await emailVerificationService(data);
      if (payload.status === false) {
        throw new Error(payload.message);
      }
      return payload;
    },
  });
  return { isPending, error, verifyEmail: mutate };
}

// confirm email verify hook
export function useconfirmVerifyEmail() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: confirmVerifyEmailData) => {
      const payload = await confirmEmailVerification(data);
      if (payload.status === false) {
        throw new Error(payload.message);
      }
      return payload;
    },
  });
  return { isPending, error, confirmVerifyEmail: mutate };
}

// register hook
export default function useRegister() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: RegisterFields) => {
      const payload = await RegisterService(data);
      if (payload.status === false) {
        throw new Error(payload.message);
      }

      return payload;
    },
  });
  return { isPending, error, register: mutate };
}
