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
import { useConfirmVerifyEmail } from "../_hooks/use-register";
import { toast } from "sonner";
import ErrorAlert from "../../_components/error-alert";
import { UseMutateFunction } from "@tanstack/react-query";
import { VerifyEmailPayload } from "@/lib/types/auth-types/register";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  ChangeEmailFields,
  ChangeEmailPayload,
} from "@/lib/types/account-settings-types/edit-profile";
import useConfirmChangeEmail from "@/app/(dashboard)/account-settings/_hooks/use-confirm-change-email";

type Props<T extends number = number> = {
  setStep: Dispatch<SetStateAction<T>> | ((step: T) => void);
  setTimer: (time: number) => void;
  timer: number;
  verifyEmail?: UseMutateFunction<
    ApiResponse<VerifyEmailPayload>,
    Error,
    verifyEmailData,
    unknown
  >;
  isPending?: boolean;
  changeEmail?: UseMutateFunction<
    ApiResponse<ChangeEmailPayload>,
    Error,
    ChangeEmailFields,
    unknown
  >;
  changeEmailPending?: boolean;
  onSuccess?: () => void;
  isChangeEmail?: boolean;
};

export default function ConfirmEmailVerification<T extends number = number>({
  timer,
  setTimer,
  setStep,
  verifyEmail,
  isPending: isVerifyingEmail,
  changeEmail,
  changeEmailPending = false,
  onSuccess,
  isChangeEmail = false,
}: Props<T>) {
  const {
    isPending: isConfirmRegisterPending,
    error: registerError,
    confirmVerifyEmail,
  } = useConfirmVerifyEmail();

  const {
    isPending: isConfirmChangePending,
    error: changeEmailError,
    confirmChangeEmail,
  } = useConfirmChangeEmail();

  const isConfirmPending = isChangeEmail
    ? isConfirmChangePending
    : isConfirmRegisterPending;
  const activeError = isChangeEmail ? changeEmailError : registerError;
  const isResendPending = isChangeEmail ? changeEmailPending : isVerifyingEmail;

  const email = getSavedEmail();

  const form = useForm<confirmVerifyEmailData>({
    defaultValues: {
      email: email ?? "",
      code: "",
    },
    resolver: zodResolver(registerStep2Schema),
  });

  const onSubmit = (data: confirmVerifyEmailData) => {
    if (isChangeEmail) {
      confirmChangeEmail(data, {
        onSuccess: () => {
          toast.success("Email changed successfully.");
          if (onSuccess) {
            onSuccess();
          }
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to confirm email change");
        },
      });
    } else {
      if (verifyEmail) {
        confirmVerifyEmail(data, {
          onSuccess: () => {
            setStep(3 as T);
            toast.success("Email verified successfully.");
          },
          onError: (error) => {
            toast.error(error?.message || "Something went wrong");
          },
        });
      }
    }
  };

  // Resend OTP Handler
  const handleResend = () => {
    if (!email) return;

    const resendCallbacks = {
      onSuccess: () => {
        startOtpTimer();
        setTimer(getOtpTimeLeft());
        toast.success("Verification code resent.");
      },
      onError: (err: Error) => {
        toast.error(err?.message || "Failed to resend code");
      },
    };

    if (isChangeEmail && changeEmail) {
      changeEmail({ email }, resendCallbacks);
    } else {
      if (verifyEmail) {
        verifyEmail({ email }, resendCallbacks);
      }
    }
  };

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
        className="p-4 sm:p-6 flex flex-col gap-y-4 w-full overflow-hidden"
      >
        {!isChangeEmail && (
          <h2 className="font-bold text-2xl sm:text-3xl font-inter">
            Create Account
          </h2>
        )}
        <h2 className="font-bold text-2xl sm:text-3xl font-inter text-blue-600">
          Verify OTP
        </h2>
        <div>
          <p className="text-gray-500 leading-normal text-xs sm:text-sm">
            Please enter the 6-digits code we have sent to:
          </p>
        </div>
        <div className="flex items-center gap-1.5 leading-none text-xs sm:text-sm break-all">
          <p className="font-medium text-gray-800">
            {email ?? "user@example.com"}
          </p>
          <span
            onClick={() => setStep(1 as T)}
            className="text-blue-600 hover:text-blue-700 transition cursor-pointer active:scale-90 font-medium shrink-0"
          >
            Edit
          </span>
        </div>

        {/* OTP Input with Mobile Responsive Sizing */}
        <Controller
          name="code"
          control={form.control}
          render={({ field }) => (
            <div className="w-full flex justify-center my-2">
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              >
                <InputOTPGroup className="w-full justify-between gap-1 sm:gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-9 h-10 sm:w-10 sm:h-12 text-base sm:text-lg"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-9 h-10 sm:w-10 sm:h-12 text-base sm:text-lg"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-9 h-10 sm:w-10 sm:h-12 text-base sm:text-lg"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-9 h-10 sm:w-10 sm:h-12 text-base sm:text-lg"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-9 h-10 sm:w-10 sm:h-12 text-base sm:text-lg"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-9 h-10 sm:w-10 sm:h-12 text-base sm:text-lg"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}
        />

        {/* Timer Section */}
        <div className="text-gray-500 text-center text-xs sm:text-sm mt-2">
          {timer > 0 ? (
            `You can request another code in: ${timer}s`
          ) : (
            <div className="font-medium flex items-center justify-center gap-1 text-xs sm:text-sm">
              <p className="text-gray-500">Didn’t receive the code?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResendPending}
                className="text-blue-600 hover:text-blue-700 transition cursor-pointer active:scale-90"
              >
                {isResendPending ? "Resending..." : "Resend"}
              </button>
            </div>
          )}
        </div>

        {activeError && !form.formState.errors.code && (
          <ErrorAlert message={activeError.message} />
        )}
        {form.formState.errors.code && (
          <ErrorAlert message={form.formState.errors.code.message} />
        )}

        <div className={`mt-2 ${isChangeEmail ? "border-t pt-4 w-full" : ""}`}>
          <Button
            className="w-full"
            variant={!isChangeEmail ? "outline" : "default"}
            type="submit"
            disabled={isConfirmPending || form.formState.isSubmitting}
          >
            {isConfirmPending || form.formState.isSubmitting
              ? "Verifying..."
              : "Verify Code"}
          </Button>
        </div>
      </form>
    </section>
  );
}
