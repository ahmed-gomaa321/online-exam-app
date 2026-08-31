import { registerSchema } from "@/lib/schemes/auth.schemes";
import z from "zod";

export type RegisterFields = z.infer<typeof registerSchema>;

export type RegisterPayload = {
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
};

export type VerifyEmailPayload = {
  code: string;
};
