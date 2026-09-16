import z from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().nonempty("please enter your old password"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string().min(8, "please Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from old password",
    path: ["password"],
  });
