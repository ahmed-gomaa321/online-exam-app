"use client";

import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import useChangePassword from "../../_hooks/use-change-password";
import { toast } from "sonner";
import ErrorAlert from "@/app/(auth)/_components/error-alert";
import { useSession } from "next-auth/react";
import { changePasswordSchema } from "@/lib/schemes/change-password.schemes";
import { useId } from "react";
import { ChangePasswordFiels } from "@/lib/types/account-settings-types/change-password";

export default function ChangePasswordForm() {
  // accessibility ids
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const { update } = useSession();

  // react query
  const { changePassword, isPending, error } = useChangePassword();

  // react hook form
  const form = useForm<ChangePasswordFiels>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  // functions
  const onSubmit = (data: ChangePasswordFiels) => {
    changePassword(data, {
      onSuccess: async (res) => {
        toast.success("Password changed successfully!");
        form.reset();
        await update({
          token: res.token,
        });
        setTimeout(() => window.location.reload(), 2000);
      },

      onError: (err) => {
        toast.dismiss();
        toast.error(err.message);
        form.setError("root", { message: err.message, type: "server" });
      },
    });
  };

  return (
    <section className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="w-full flex flex-col gap-y-4"
      >
        <FieldGroup>
          {/* Current Password */}
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="border-b pb-6"
              >
                <FieldLabel htmlFor={currentPasswordId}>
                  Current Password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id={currentPasswordId}
                  placeholder="********"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />

          {/* New Password */}
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={newPasswordId}>New Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id={newPasswordId}
                  placeholder="********"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={confirmPasswordId}>
                  Confirm New Password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id={confirmPasswordId}
                  placeholder="********"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Error Alert */}
        {error && (
          <ErrorAlert
            message={
              error.message === "old password incorrect"
                ? error.message
                : "Something went wrong"
            }
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="font-medium px-2 mt-8"
        >
          {isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </section>
  );
}
