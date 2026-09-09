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

type Props = {
  setStep: (step: 1 | 2 | 3 | 4) => void;
  verifyEmail: UseMutateFunction<
    ApiResponse<VerifyEmailPayload>,
    Error,
    verifyEmailData,
    unknown
  >;
  isPending: boolean;
  error: Error | null;
};

export default function EmailVerification({
  setStep,
  verifyEmail,
  isPending,
  error,
}: Props) {
  // react hook form
  const form = useForm<verifyEmailData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(registerStep1Schema),
  });

  const onSubmit = (data: verifyEmailData) => {
    verifyEmail(data, {
      onSuccess: () => {
        saveEmail(data.email);
        toast.success("Verification code sent to your email.");
        setStep(2);
        startOtpTimer();
      },
      onError: (error) => {
        toast.error(error?.message || "Something went wrong");
      },
    });
  };

  return (
    <section className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-8 flex flex-col gap-y-4"
      >
        <h2 className="font-bold text-3xl font-inter">Create Account</h2>
        <FieldGroup>
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

        {error && <ErrorAlert message={error.message} />}

        <Button
          variant={"outline"}
          type="submit"
          disabled={form.formState.isSubmitting || isPending}
        >
          {form.formState.isSubmitting || isPending ? (
            "Sending..."
          ) : (
            <span className="flex justify-center items-center gap-1">
              Next <ChevronRight />
            </span>
          )}
        </Button>
      </form>

      <FormFooter
        text="Already have an account?"
        linkText="Login"
        linkHref={ROUTES.LOGIN}
      />
    </section>
  );
}
