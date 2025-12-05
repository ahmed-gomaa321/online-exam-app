import z from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty("please enter your old password"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    rePassword: z.string().min(8, "please Confirm your password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  })
  .refine((data) => data.password !== data.oldPassword, {
    message: "New password must be different from old password",
    path: ["password"],
  });
