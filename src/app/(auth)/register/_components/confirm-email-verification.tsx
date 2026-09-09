"use client";

import { Controller, useForm } from "react-hook-form";
import {
  confirmVerifyEmailData,
  registerStep2Schema,
  verifyEmailData,
} from "@/lib/schemes/auth.schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  getOtpTimeLeft,
  getSavedEmail,
  startOtpTimer,
} from "../../../../lib/utils/otp-timer-presisted";
import { useconfirmVerifyEmail } from "../_hooks/use-register";
import { toast } from "sonner";
import ErrorAlert from "../../_components/error-alert";
import { UseMutateFunction } from "@tanstack/react-query";
import { VerifyEmailPayload } from "@/lib/types/auth-types/register";
import { useEffect } from "react";

type Props = {
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setTimer: (time: number) => void;
  timer: number;
  verifyEmail: UseMutateFunction<
    ApiResponse<VerifyEmailPayload>,
    Error,
    verifyEmailData,
    unknown
  >;
  isPending: boolean;
};

export default function EmailVerification({
  timer,
  setTimer,
  setStep,
  verifyEmail,
  isPending: isVerifyingEmail,
}: Props) {
  // tanstack query
  const { isPending, error, confirmVerifyEmail } = useconfirmVerifyEmail();

  // email from local storage
  const email = getSavedEmail();

  // react hook form
  const form = useForm<confirmVerifyEmailData>({
    defaultValues: {
      email: email ?? "",
      code: "",
    },
    resolver: zodResolver(registerStep2Schema),
  });

  const onSubmit = (data: confirmVerifyEmailData) => {
    confirmVerifyEmail(data, {
      onSuccess: () => {
        setStep(3);
        toast.success("Email verified successfully.");
      },
      onError: (error) => {
        toast.error(error?.message || "Something went wrong");
      },
    });
  };

  // handle resend code
  const handleResend = () => {
    if (!email) return;
    verifyEmail(
      { email },
      {
        onSuccess: () => {
          startOtpTimer();
          setTimer(getOtpTimeLeft());
        },
      },
    );
  };

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(getOtpTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-8 flex flex-col gap-y-4"
      >
        <h2 className="font-bold text-3xl font-inter">Create Account</h2>
        <h2 className="font-bold text-3xl font-inter text-blue-600">
          Verify OTP
        </h2>
        <div>
          <p className="text-gray-500 leading-none text-sm">
            Please enter the 6-digits code we have sent to:
          </p>
        </div>
        <div className="flex items-center gap-1 leading-none text-sm">
          <p>{email ?? "user@example.com."}</p>
          <span
            onClick={() => setStep(1)}
            className="text-blue-600 hover:text-blue-700 transition cursor-pointer active:scale-90"
          >
            Edit
          </span>
        </div>
        {/* otp field */}
        <Controller
          name="code"
          control={form.control}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
            >
              <InputOTPGroup className="mt-4 w-full justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {/* timer */}
        <p className="text-gray-500 text-center text-sm mt-6">
          {timer > 0 ? (
            `You can request another code in: ${timer}s`
          ) : (
            <div className="font-medium flex items-center justify-center gap-1 text-sm">
              <p className="text-gray-500">Didn’t receive the code? </p>
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-700 transition cursor-pointer active:scale-90"
              >
                {isVerifyingEmail ? "Resending..." : "Resend"}
              </button>
            </div>
          )}
        </p>
        {error && !form.formState.errors.code && (
          <ErrorAlert message={error.message} />
        )}
        {form.formState.errors.code && (
          <ErrorAlert message={form.formState.errors.code.message} />
        )}

        {/* Submit button */}
        <Button
          variant={"outline"}
          type="submit"
          disabled={isPending || form.formState.isSubmitting}
          className="w-full mt-4 flex items-center justify-center gap-x-2"
        >
          {isPending || form.formState.isSubmitting
            ? "Verifying..."
            : "Verify Code"}
        </Button>
      </form>
    </section>
  );
}
