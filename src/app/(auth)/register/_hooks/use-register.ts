"use client";

import { ROUTES } from "@/lib/constants/routes";
import { RegisterFields } from "@/lib/types/auth-types/register";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import RegisterService from "../_actions/register.service";
import { toast } from "sonner";

export default function useRegister() {
  const router = useRouter();
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: RegisterFields) => {
      const payload = await RegisterService(data);
      if ("code" in payload) {
        throw new Error(payload.message);
      }

      return payload;
    },
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      router.push(ROUTES.LOGIN);
    },
  });
  return { isPending, error, register: mutate };
}
