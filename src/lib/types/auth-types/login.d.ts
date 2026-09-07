import { loginSchema } from "@/lib/schemes/auth.schemes";
import { z } from "zod";
export type LoginFields = z.infer<typeof loginSchema>;
