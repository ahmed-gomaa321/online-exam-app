import { resetPasswordSchema } from "@/lib/schemes/auth.schemes";

export type ForgotPasswordFields = {
  email: string;
  redirectUrl: string;
};

export type SendEmailResponse = {
  message: string;
  resetToken: string;
};

export type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;
