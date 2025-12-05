"use client";
import { deleteMyAccount } from "@/lib/services/delete-my-account.service";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function useDeleteMyAccount() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async () => {
      const res = await deleteMyAccount();
      if ("code" in res) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await signOut();
    },
  });
  return { isPending, error, deleteMyAccount: mutate };
}
