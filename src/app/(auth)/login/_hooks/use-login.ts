"use client";
import { LoginFields } from "@/lib/types/auth-types/login";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export default function useLogin() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: LoginFields) => {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (!res?.ok) {
        throw new Error(res?.error || "Login failed, please try again.");
      }
      return res;
    },
    onSuccess: () => {
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl") || "/";
      window.location.replace(callbackUrl);
    },
  });
  return { isPending, error, login: mutate };
}
