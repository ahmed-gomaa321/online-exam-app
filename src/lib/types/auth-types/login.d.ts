import { loginSchema } from "@/lib/schemas/auth.schemes";
import { z } from "zod";
export type LoginFields = z.infer<typeof loginSchema>;
