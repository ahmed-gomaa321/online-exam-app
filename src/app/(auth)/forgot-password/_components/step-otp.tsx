"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  ForgotPasswordFields,
  SendEmailResponse,
  VerifyOtpFields,
} from "@/lib/types/auth-types/forgot-password";
import useVerifyOtp from "../_hooks/use-verify-otp";
import { verifyOtpSchema } from "@/lib/schemes/auth.schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { MoveLeft, MoveRight } from "lucide-react";
import { Form } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { UseMutateFunction } from "@tanstack/react-query";
import {
  clearSavedEmail,
  clearSavedStep,
  getOtpTimeLeft,
  getSavedEmail,
  startOtpTimer,
} from "../_utils/otp-timer-presisted";
import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";
import { useEffect } from "react";

type StepOtpProps = {
  timer: number;
  setTimer: (time: number) => void;
  setStep: (step: number) => void;
  sendEmail: UseMutateFunction<
    SendEmailResponse,
    Error,
    ForgotPasswordFields,
    unknown
  >;
};
export default function StepOtp({
  timer,
  setStep,
  sendEmail,
  setTimer,
}: StepOtpProps) {
  // email
  const email = getSavedEmail();
  // hooks
  const { verifyOtp, isPending, error } = useVerifyOtp();
  // react hook form
  const form = useForm<VerifyOtpFields>({
    defaultValues: {
      resetCode: "",
    },
    resolver: zodResolver(verifyOtpSchema),
  });
  // otp value
  const otpValue = form.watch("resetCode");
  const onSubmit = (data: VerifyOtpFields) => {
    verifyOtp(data, {
      onSuccess: () => {
        localStorage.removeItem("otp_time");
        setStep(3);
        clearSavedStep();
      },
      onError: (err) => {
        form.setError("resetCode", { message: err.message });
      },
    });
  };
  // auto send
  useEffect(() => {
    if (otpValue.length === 6) {
      verifyOtp(
        { resetCode: otpValue },
        {
          onSuccess: () => {
            localStorage.removeItem("otp_time");
            setStep(3);
            clearSavedStep();
          },
          onError: (err) => {
            form.setError("resetCode", { message: err.message });
          },
        }
      );
    } else {
      form.clearErrors("resetCode");
    }
  }, [otpValue]);
  const handleResend = () => {
    if (!email) return;
    sendEmail(
      { email },
      {
        onSuccess: () => {
          startOtpTimer();
          setTimer(getOtpTimeLeft());
        },
      }
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
    <section className="flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 w-full flex flex-col gap-y-4"
        >
          <button
            disabled={timer > 0}
            className="me-auto mb-8 border p-3 hover:bg-gray-50 transition disabled:hover:bg-white"
            type="button"
            onClick={() => setStep(1)}
          >
            <MoveLeft />
          </button>
          <h2 className="font-bold text-3xl font-inter">Verify OTP</h2>
          <div>
            <p className="text-gray-500 leading-none">
              Please enter the 6-digits code we have sent to:
            </p>
          </div>
          <div className="flex items-center gap-1 leading-none">
            <p>user@example.com.</p>
            <span
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 transition cursor-pointer active:scale-90"
            >
              Edit
            </span>
          </div>
          {/* otp field */}
          <Controller
            name="resetCode"
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
                  onClick={handleResend}
                  className="text-blue-600 hover:text-blue-700 transition cursor-pointer active:scale-90"
                >
                  Resend
                </button>
              </div>
            )}
          </p>
          {error && !form.formState.errors.resetCode && (
            <ErrorAlert message={error.message} />
          )}
          {form.formState.errors.resetCode && (
            <ErrorAlert message={form.formState.errors.resetCode.message} />
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 flex items-center justify-center gap-x-2"
          >
            {isPending ? (
              "Verifying..."
            ) : (
              <>
                Verify Code <MoveRight />
              </>
            )}
          </Button>
        </form>
      </Form>
      <FormFooter
        text="Don't have an account?"
        linkText="create yours"
        linkHref={ROUTES.REGISTER}
      />
    </section>
  );
}
