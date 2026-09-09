"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ResetPasswordFields } from "@/lib/types/auth-types/forgot-password";
import { resetPasswordSchema } from "@/lib/schemes/auth.schemes";
import { ROUTES } from "@/lib/constants/routes";
import { clearSavedEmail } from "@/lib/utils/otp-timer-presisted";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/password-input";

import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";
import useResetPassword from "../_hooks/use-reset-password";

export default function StepResetPassword() {
  const router = useRouter();

  // Accessibility IDs
  const formTitleId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  // Hooks
  const { resetPassword, isPending, error } = useResetPassword();

  // React Hook Form
  const form = useForm<ResetPasswordFields>({
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFields) => {
    // Safely retrieve token on client side execution
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    if (!token) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    resetPassword(
      { ...data, token },
      {
        onSuccess: () => {
          router.replace(ROUTES.LOGIN);
          toast.success("Password reset successful! Please login.");
          clearSavedEmail();
          localStorage.removeItem("token");
        },
        onError: (err) => {
          form.setError("root", { message: err.message, type: "server" });
        },
      },
    );
  };

  const serverErrorMessage =
    form.formState.errors.root?.message || error?.message;

  return (
    <section className="flex flex-col items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-labelledby={formTitleId}
        noValidate
        className="p-8 w-full flex flex-col gap-y-4"
      >
        <h2
          id={formTitleId}
          className="font-bold text-gray-800 lg:text-3xl font-inter"
        >
          Create a New Password
        </h2>
        <p className="text-gray-500 text-sm lg:text-base lg:mb-6">
          Create a new strong password for your account.
        </p>

        <FieldGroup className="flex flex-col gap-y-4">
          {/* New Password Field */}
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-2"
              >
                <Label htmlFor={newPasswordId}>New Password</Label>
                <PasswordInput
                  {...field}
                  id={newPasswordId}
                  placeholder="********"
                  error={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-2"
              >
                <Label htmlFor={confirmPasswordId}>Confirm New Password</Label>
                <PasswordInput
                  {...field}
                  id={confirmPasswordId}
                  placeholder="********"
                  error={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        {serverErrorMessage && <ErrorAlert message={serverErrorMessage} />}

        <Button
          type="submit"
          disabled={isPending || form.formState.isSubmitting}
          className="mt-4 w-full font-medium py-2"
        >
          {isPending || form.formState.isSubmitting
            ? "Resetting..."
            : "Reset Password"}
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
