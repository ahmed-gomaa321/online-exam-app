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

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_. ]+$/,
      "Username can only contain letters, numbers, _ and spaces"
    )
    .optional(),

  email: z.string().email("Please enter a valid email").optional(),

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
