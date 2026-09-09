"use client";

import { ROUTES } from "@/lib/constants/routes";
import { getSavedEmail } from "../../../../lib/utils/otp-timer-presisted";
import FormFooter from "../../_components/form-footer";
import { MoveLeft } from "lucide-react";

type StepEmailProps = {
  setStep: (step: number) => void;
};

export default function StepInformation({ setStep }: StepEmailProps) {
  // email
  const email = getSavedEmail();

  return (
    <section className="flex flex-col text-xs sm:text-sm md:text-base">
      <div
        className="mb-10 flex justify-center items-center border border-gray-200 size-10 cursor-pointer"
        onClick={() => setStep(1)}
      >
        <MoveLeft />
      </div>
      <h2 className="text-gray-800 font-bold text-3xl font-inter">
        Password Reset Sent
      </h2>
      <div className="mt-4">
        We have sent a password reset link to:
        <p className="text-blue-500">
          {email ?? "user@example.com."}
          <span className="text-black">.</span>
        </p>
      </div>
      <p className="mt-4">
        Please check your inbox and follow the
        <p>instructions to reset your password.</p>
      </p>
      <p className="text-gray-500 mt-4 pb-4 mb-10">
        If you don’t see the email within a few minutes,
        <p>check your spam or junk folder.</p>
      </p>
      <FormFooter
        className="me-auto"
        text="Don't have an account?"
        linkText="create yours"
        linkHref={ROUTES.REGISTER}
      />
    </section>
  );
}
