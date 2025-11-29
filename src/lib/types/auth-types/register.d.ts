import { registerSchema } from "@/lib/schemes/auth.schemes";
import z from "zod";

export type RegisterFields = z.infer<typeof registerSchema>;