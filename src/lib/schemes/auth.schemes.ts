// make schemes for auth
// login schemes
import { email, z } from "zod";

// login scheme
export const loginSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: z.string().nonempty("please enter your password"),
});

// ---------------------------------------------------------------------------

// register schemes

// 1. Base Schema
export const baseRegisterSchema = z.object({
  email: z
    .string()
    .refine((val) => val.length > 0, { message: "Please enter your email" })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email",
    }),

  code: z
    .string()
    .length(6, { message: "Please enter a valid 6-digit verification code" }),

  firstName: z
    .string()
    .min(1, { message: "Please enter your first name" })
    .min(2, { message: "First name must be at least 2 characters" }),

  lastName: z
    .string()
    .min(1, { message: "Please enter your last name" })
    .min(2, { message: "Last name must be at least 2 characters" }),

  username: z
    .string()
    .min(1, { message: "Please enter your username" })
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username can only contain letters, numbers, _, and spaces",
    ),

  phone: z
    .string()
    .nonempty("please enter your phone number")
    .transform((val) => {
      if (!val) return "";
      let cleaned = val.replace(/\s+/g, "").replace(/^(?:\+?20|0020)/, "0");
      if (!cleaned.startsWith("0") && cleaned.length >= 10)
        cleaned = "0" + cleaned;
      return cleaned;
    })
    .refine((val) => /^01[0125][0-9]{8}$/.test(val), {
      message: "Invalid Egyptian phone number",
    }),

  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    }),

  confirmPassword: z.string(),
});

//  Step Schemas 1
export const registerStep1Schema = baseRegisterSchema.pick({
  email: true,
});

//  Step Schemas 2
export const registerStep2Schema = baseRegisterSchema.pick({
  email: true,
  code: true,
});

//  Step Schemas 3
export const registerStep3Schema = baseRegisterSchema.pick({
  firstName: true,
  lastName: true,
  username: true,
  phone: true,
});

//  step Schemas 4
export const registerStep4Schema = baseRegisterSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

//  Complete Register Schema
export const registerSchema = baseRegisterSchema
  .omit({ code: true })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

//  Inferred TypeScript Types
export type verifyEmailData = z.infer<typeof registerStep1Schema>;
export type confirmVerifyEmailData = z.infer<typeof registerStep2Schema>;
export type personInfoData = z.infer<typeof registerStep3Schema>;
export type passData = z.infer<typeof registerStep4Schema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
// ---------------------------------------------------------------------------

// forgot password scheme

// send email scheme
export const sendEmailSchema = z.object({
  email: z
    .string()
    .refine((val) => val.length > 0, { message: "Please enter your email" })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email",
    }),
  redirectUrl: z.string(),
});
// verify otp scheme
export const verifyOtpSchema = z.object({
  resetCode: z
    .string("please enter otp")
    .refine((val) => val.length === 6, "Please enter a valid otp (6 digits)"),
});

// reset password scheme
export const resetPasswordSchema = z
  .object({
    token: z.string().optional(),
    newPassword: z
      .string()
      .nonempty("please enter your password")
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
