"use client";

import { useEffect, useState } from "react";
import StepEmail from "./step-email";
import StepResetPassword from "./step-reset-password";
import StepInformation from "./step-information";
import { useSearchParams } from "next/navigation";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const setStepState = (newStep: number) => {
    setStep(newStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepEmail setStep={setStepState} />;

      case 2:
        return <StepInformation setStep={setStepState} />;

      case 3:
        return <StepResetPassword />;

      default:
        return null;
    }
  };

  useEffect(() => {
    // if there is token go to step 3
    if (token) {
      localStorage.setItem("token", token);
      setStep(3);
    } else {
      setStep((prev) => prev);
    }
  }, []);

  return <section className="w-10/12 lg:w-3/4">{renderStep()}</section>;
}
