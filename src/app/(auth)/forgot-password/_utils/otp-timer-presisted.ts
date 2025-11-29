export const OtpExpirTime = 60;

export const startOtpTimer = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem("otp_time", Date.now().toString());
};

export const getOtpTimeLeft = () => {
  if (typeof window === "undefined") return 0;

  const savedTime = localStorage.getItem("otp_time");
  if (!savedTime) return 0;

  const diff =
    OtpExpirTime - Math.floor((Date.now() - Number(savedTime)) / 1000);

  return diff > 0 ? diff : 0;
};

export const saveStep = (step: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("forgot_password_step", step.toString());
};

export const getSavedStep = (): number => {
  if (typeof window === "undefined") return 1;

  const step = localStorage.getItem("forgot_password_step");
  return step ? +step : 1;
};

export const saveEmail = (email: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("email", email);
};

export const getSavedEmail = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("email");
};

export const clearSavedEmail = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("email");
};

export const clearSavedStep = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("forgot_password_step");
};
