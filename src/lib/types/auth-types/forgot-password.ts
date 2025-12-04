export type ForgotPasswordFields = {
  email: string;
};

export type SendEmailResponse = {
  message: string;
  info: string;
};

export type VerifyOtpFields = {
  resetCode: string;
};
export type ResetPasswordFields = {
  email: string;
  newPassword: string;
  confirmNewPassword?: string;
};
