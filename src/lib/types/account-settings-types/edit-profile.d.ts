import {
  changeEmailSchema,
  editProfileSchema,
} from "@/lib/schemes/account-settings.schemes";

export type ProfileFormFields = z.infer<typeof editProfileSchema>;

export type ChangeEmailFields = z.infer<typeof changeEmailSchema>;

export type ChangeEmailPayload = {
  message: string;
  code: string;
};

export type ConfirmChangeEmailFields = {
  code: string;
};

export type ConfirmChangeEmailPayload = {
  message: string;
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
};
