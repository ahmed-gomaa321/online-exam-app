import { editProfileSchema } from "@/lib/schemas/account-settings.schemes";

export type ProfileFormFields = z.infer<typeof editProfileSchema>;
