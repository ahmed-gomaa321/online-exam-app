"use client";

import { ForgotPasswordFields } from "@/lib/types/auth-types/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { saveEmail } from "../../../../lib/utils/otp-timer-presisted";
import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";
import { sendEmailSchema } from "@/lib/schemes/auth.schemes";
import useSendEmail from "../_hooks/use-send-email";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useId } from "react";

type StepEmailProps = {
  setStep: (step: number) => void;
};

export default function StepEmail({ setStep }: StepEmailProps) {
  // hooks
  const { sendEmail, isPending, error } = useSendEmail();

  // unique ids for accessibility
  const formTitleId = useId();
  const emailId = useId();

  // react hook form
  const form = useForm<ForgotPasswordFields>({
    defaultValues: {
      email: "",
      redirectUrl: "",
    },
    resolver: zodResolver(sendEmailSchema),
  });
  const onSubmit = (data: ForgotPasswordFields) => {
    sendEmail(
      {
        ...data,
        redirectUrl: `${window.location.origin}${ROUTES.FORGOT_PASSWORD}`,
      },
      {
        onSuccess: () => {
          saveEmail(data?.email);
          setStep(2);
        },
        onError: (err) => {
          form.setError("root", { message: err.message, type: "server" });
        },
      },
    );
  };
  return (
    <section className="w-full flex flex-col items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-labelledby={formTitleId}
        noValidate
        className="p-8 w-full flex flex-col gap-y-4"
      >
        <h2 id={formTitleId} className="font-bold text-3xl font-inter">
          Forgot Password
        </h2>
        <p className="text-gray-500 mt-2 mb-4">
          Don’t worry, we will help you recover your account.
        </p>
        {/* Email field */}
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-inter" htmlFor={emailId}>
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  autoFocus
                  ref={field.ref}
                  id={emailId}
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

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isPending || form.formState.isSubmitting}
          className="w-full mt-4 flex items-center justify-center gap-x-2"
        >
          {isPending || form.formState.isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Next <ChevronRight />
            </>
          )}
        </Button>
      </form>
      <FormFooter
        text="Don't have an account?"
        linkText="create yours"
        linkHref={ROUTES.REGISTER}
      />
    </section>
  );
}
