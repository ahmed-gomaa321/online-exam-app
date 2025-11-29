"use client";

import { useEffect, useState } from "react";
import StepEmail from "./step-email";
import StepOtp from "./step-otp";
import StepResetPassword from "./step-reset-password";
import useSendEmail from "../_hooks/use-send-email";
import { getOtpTimeLeft, saveStep } from "../_utils/otp-timer-presisted";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(getOtpTimeLeft() || 0);

  // hooks
  const { sendEmail, isPending, error } = useSendEmail();

  const setStepState = (newStep: number) => {
    setStep(newStep);
    saveStep(newStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepEmail
            setStep={setStepState}
            sendEmail={sendEmail}
            isPending={isPending}
            error={error}
          />
        );

      case 2:
        return (
          <StepOtp
            timer={timer}
            setTimer={setTimer}
            setStep={setStepState}
            sendEmail={sendEmail}
          />
        );

      case 3:
        return <StepResetPassword />;

      default:
        return null;
    }
  };
  useEffect(() => {
    const timeLeft = getOtpTimeLeft();
    setTimer(timeLeft);

    if (timeLeft > 0) {
      setStep(2);
    } else {
      setStep((prev) => prev);
    }
  }, []);

  return <section className="w-full lg:w-3/4">{renderStep()}</section>;
}
