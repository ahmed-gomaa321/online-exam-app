import { changePasswordSchema } from "@/lib/schemas/change-password.schemes";
import z from "zod";

export type changePasswordFiels = z.infer<typeof changePasswordSchema>;
