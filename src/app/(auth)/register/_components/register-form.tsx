"use client";

import { useEffect, useState } from "react";
import ConfirmEmailVerification from "./confirm-email-verification";
import EmailVerification from "./email-verification";
import PasswordForm from "./password-form";
import PersonalInfo from "./personal-info";
import { getOtpTimeLeft } from "../../forgot-password/_utils/otp-timer-presisted";
import Stepper from "./stepper";
import { useverifyEmail } from "../_hooks/use-register";

type Step = 1 | 2 | 3 | 4;

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const totalSteps = 4;
  const [timer, setTimer] = useState(getOtpTimeLeft() || 0);

  // hooks
  const { verifyEmail, isPending, error } = useverifyEmail();

  // useEffect
  useEffect(() => {
    const timeLeft = getOtpTimeLeft() || 0;
    setTimer(timeLeft);

    if (timeLeft > 0) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, []);

  // render
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EmailVerification
            verifyEmail={verifyEmail}
            isPending={isPending}
            error={error}
            setStep={setCurrentStep}
          />
        );
      case 2:
        return (
          <ConfirmEmailVerification
            setStep={setCurrentStep}
            timer={timer}
            setTimer={setTimer}
            verifyEmail={verifyEmail}
            isPending={isPending}
          />
        );
      case 3:
        return <PersonalInfo setStep={setCurrentStep} />;
      case 4:
        return <PasswordForm />;
    }
  };

  return (
    <section className="w-full md:w-3/4 flex flex-col items-center justify-center pt-4">
      {/* Dynamic Progress Bar */}
      <Stepper currentStep={currentStep} totalSteps={totalSteps} />
      {/* Render the current step */}
      {renderStep()}
    </section>
  );
}
