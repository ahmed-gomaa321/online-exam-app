import { changePasswordSchema } from "@/lib/schemes/change-password.schemes";
import z from "zod";

export type ChangePasswordFiels = z.infer<typeof changePasswordSchema>;
export type ChangePasswordResponse = {
  message: string;
};
