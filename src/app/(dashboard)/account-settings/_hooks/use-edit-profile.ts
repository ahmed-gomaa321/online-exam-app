"use client";
import { editProfile } from "@/lib/services/edit-profile.service";
import { ProfileFormFields } from "@/lib/types/account-settings-types/edit-profile";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { toast } from "sonner";

type UpdateSession = (
  data?: Partial<Session> | undefined,
  force?: boolean,
) => Promise<Session | null>;

export default function useEditProfile(
  update: UpdateSession,
  session: Session | null,
) {
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (data: ProfileFormFields) => {
      const res = await editProfile(data);
      if (res?.status === "false") {
        throw new Error(res.message);
      }

      return res;
    },

    onSuccess: async (res) => {
      toast.success("Profile updated successfully");

      const updatedFields = res?.user || res?.data || res?.payload?.user;

      if (session) {
        await update({
          user: {
            ...session.user,
            ...updatedFields,
          },
        });
      }
    },
  });

  return { isPending, error, editProfile: mutate };
}
