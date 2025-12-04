import { editProfileSchema } from "@/lib/schemes/account-settings.schemes";

export type ProfileFormFields = z.infer<typeof editProfileSchema>;