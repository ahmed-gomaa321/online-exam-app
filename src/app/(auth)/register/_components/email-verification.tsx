"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FormFooter from "../../_components/form-footer";
import { ROUTES } from "@/lib/constants/routes";
import { Controller, useForm } from "react-hook-form";
import {
  registerStep1Schema,
  verifyEmailData,
} from "@/lib/schemes/auth.schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  saveEmail,
  startOtpTimer,
} from "../../../../lib/utils/otp-timer-presisted";
import { toast } from "sonner";
import ErrorAlert from "../../_components/error-alert";
import { UseMutateFunction } from "@tanstack/react-query";
import { VerifyEmailPayload } from "@/lib/types/auth-types/register";
import { Dispatch, SetStateAction } from "react";
import {
  ChangeEmailFields,
  ChangeEmailPayload,
} from "@/lib/types/account-settings-types/edit-profile";

type Props<T extends number = number> = {
  setStep: Dispatch<SetStateAction<T>> | ((step: T) => void);
  verifyEmail?: UseMutateFunction<
    ApiResponse<VerifyEmailPayload>,
    Error,
    verifyEmailData,
    unknown
  >;
  isPending?: boolean;
  error?: Error | null;
  changeEmail?: UseMutateFunction<
    ApiResponse<ChangeEmailPayload>,
    Error,
    ChangeEmailFields,
    unknown
  >;
  changeEmailPending?: boolean;
  changeEmailError?: Error | null;
  isChangeEmail?: boolean;
};

export default function EmailVerification<T extends number>({
  setStep,
  verifyEmail,
  isPending,
  error,
  changeEmail,
  changeEmailPending = false,
  changeEmailError = null,
  isChangeEmail = false,
}: Props<T>) {
  // react hook form
  const form = useForm<verifyEmailData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(registerStep1Schema),
  });

  const activePending = isChangeEmail ? changeEmailPending : isPending;
  const activeError = isChangeEmail ? changeEmailError : error;

  const onSubmit = (data: verifyEmailData) => {
    const handleSuccess = () => {
      saveEmail(data.email);
      toast.success("Verification code sent to your email.");
      setStep(2 as T);
      startOtpTimer();
    };

    const handleError = (err: Error) => {
      toast.error(err?.message || "Something went wrong");
    };

    if (isChangeEmail && changeEmail) {
      const payload = { newEmail: data.email } as unknown as ChangeEmailFields;
      changeEmail(payload, {
        onSuccess: handleSuccess,
      });
    } else {
      if (verifyEmail) {
        verifyEmail(data, {
          onSuccess: handleSuccess,
          onError: handleError,
        });
      }
    }
  };

  return (
    <section className="w-full">
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
        className={`${!isChangeEmail ? "p-8" : "pt-0 space-y-6"} flex flex-col gap-y-4`}
      >
        {!isChangeEmail && (
          <h2 className="font-bold text-3xl font-inter">Create Account</h2>
        )}
        <FieldGroup className={`${!isChangeEmail ? "" : "w-11/12 mx-auto"}`}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  autoFocus
                  ref={field.ref}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="user@example.com"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* error */}
        {activeError && <ErrorAlert message={activeError.message} />}

        <div className={`${isChangeEmail ? "border-t pt-6 w-full" : ""}`}>
          <Button
            className="w-full"
            variant={!isChangeEmail ? "outline" : "default"}
            type="submit"
            disabled={form.formState.isSubmitting || activePending}
          >
            {form.formState.isSubmitting || activePending ? (
              "Sending..."
            ) : (
              <span className="flex justify-center items-center gap-1">
                Next <ChevronRight />
              </span>
            )}
          </Button>
        </div>
      </form>

      {!isChangeEmail && (
        <FormFooter
          text="Already have an account?"
          linkText="Login"
          linkHref={ROUTES.LOGIN}
        />
      )}
    </section>
  );
}
