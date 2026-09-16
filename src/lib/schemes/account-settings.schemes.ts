import { z } from "zod";

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  profilePhoto: z.string().optional(),
  phone: z
    .string()
    .transform((val) => {
      if (!val) return "";
      let cleaned = val.replace(/\s+/g, "").replace(/^(?:\+?20|0020)/, "0");
      if (!cleaned.startsWith("0") && cleaned.length >= 10)
        cleaned = "0" + cleaned;
      return cleaned;
    })
    .refine((val) => {
      if (!val) return true;
      return /^01[0125][0-9]{8}$/.test(val);
    }, "Invalid Egyptian phone number")
    .optional(),
});

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .refine((val) => val.length > 0, { message: "Please enter your new email" })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email",
    }),
});
