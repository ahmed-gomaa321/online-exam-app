// make schemes for auth
// login schemes
import { email, z } from "zod";

// login scheme
export const loginSchema = z.object({
  email: z
    .string()
    .refine((val) => val.length > 0, { message: "Please enter your email" })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email",
    }),
  password: z.string().nonempty("please enter your password"),
});

// ---------------------------------------------------------------------------

// register scheme
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .nonempty("please enter your first name")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .nonempty("please enter your last name")
      .min(2, "Last name must be at least 2 characters"),
    username: z
      .string()
      .nonempty("please enter your username")
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and _"
      ),
    email: z
      .string()
      .refine((val) => val.length > 0, { message: "Please enter your email" })
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Please enter a valid email",
      }),
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
      .nonempty("please enter your password")
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });
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
    email: z
      .string()
      .refine((val) => val.length > 0, { message: "Please enter your email" })
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Please enter a valid email",
      }),
    newPassword: z
      .string()
      .nonempty("please enter your password")
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),
    confirmNewPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });
