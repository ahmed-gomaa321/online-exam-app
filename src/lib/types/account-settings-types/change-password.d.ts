import { changePasswordSchema } from "@/lib/schemes/change-password.schemes";
import z from "zod";

export type changePasswordFiels = z.infer<typeof changePasswordSchema>;
