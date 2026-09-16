"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmailVerification from "@/app/(auth)/register/_components/email-verification";
import Stepper from "@/app/(auth)/register/_components/stepper";
import { getOtpTimeLeft } from "@/lib/utils/otp-timer-presisted";
import { useEffect, useState } from "react";
import { PencilLine } from "lucide-react";
import ConfirmEmailVerification from "@/app/(auth)/register/_components/confirm-email-verification";
import useChangeEmail from "../_hooks/use-change-email";

type Step = 1 | 2;

export default function ChangeEmail() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const totalSteps = 2;
  const [timer, setTimer] = useState(getOtpTimeLeft() || 0);

  // hooks
  const {
    changeEmail,
    isPending: changeEmailPending,
    error: changeEmailError,
  } = useChangeEmail();

  // Check OTP timer on mount
  useEffect(() => {
    const timeLeft = getOtpTimeLeft() || 0;
    setTimer(timeLeft);

    if (timeLeft > 0) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, []);

  // Reset or sync step when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      const timeLeft = getOtpTimeLeft() || 0;
      setTimer(timeLeft);
      setCurrentStep(timeLeft > 0 ? 2 : 1);
    }
  };

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EmailVerification
            changeEmail={changeEmail}
            changeEmailPending={changeEmailPending}
            changeEmailError={changeEmailError}
            setStep={setCurrentStep}
            isChangeEmail={true}
          />
        );
      case 2:
        return (
          <ConfirmEmailVerification
            setStep={setCurrentStep}
            timer={timer}
            setTimer={setTimer}
            changeEmail={changeEmail}
            changeEmailPending={changeEmailPending}
            onSuccess={() => setIsOpen(false)}
            isChangeEmail={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <p className="text-sm flex items-center gap-1 text-nowrap cursor-pointer text-blue-600 hover:text-blue-700 transition-all duration-300">
          <span>
            <PencilLine size={16} />
          </span>
          Change
        </p>
      </DialogTrigger>

      <DialogContent className="w-11/12 mx-auto">
        {/* Progress Stepper */}
        <div className="py-2">
          <Stepper
            isChangeEmail={true}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>
        <DialogHeader className="w-11/12 mx-auto">
          <DialogTitle className="font-bold text-gray-800 md:text-3xl">
            Change Email
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 ? (
              <p className="font-bold text-blue-600 mt-6 md:text-2xl">
                Enter your new email
              </p>
            ) : (
              ""
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Dynamic Step View */}
        <div className="w-full p-0 mx-auto">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
}
