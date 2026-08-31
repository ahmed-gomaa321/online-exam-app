"use client";

import { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RegisterFormData, registerSchema } from "@/lib/schemes/auth.schemes";
import { PasswordInput } from "@/components/shared/password-input";
import useRegister from "../_hooks/use-register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import {
  clearOtpTimer,
  clearSavedEmail,
} from "../../forgot-password/_utils/otp-timer-presisted";

export default function PasswordStep() {
  const router = useRouter();
  const { isPending, register } = useRegister();

  const formTitleId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const form = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  // useEffect
  useEffect(() => {
    const savedInfo = localStorage.getItem("personal-info");
    const savedEmail = localStorage.getItem("email");

    const parsedInfo = savedInfo ? JSON.parse(savedInfo) : {};

    form.reset({
      firstName: parsedInfo.firstName || "",
      lastName: parsedInfo.lastName || "",
      username: parsedInfo.username || "",
      phone: parsedInfo.phone || "",
      email: savedEmail || parsedInfo.email || "",
      password: "",
      confirmPassword: "",
    });
  }, [form]);

  const onSubmit = (data: RegisterFormData) => {
    console.log("form data:" ,data);
    
    register(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Successfully registered, please login");
        localStorage.removeItem("personal-info");
        clearOtpTimer();
        clearSavedEmail();
        router.replace(ROUTES.LOGIN);
      },
      onError: (err) => {
        toast.error(err?.message || "Something went wrong");
      },
    });
  };

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-labelledby={formTitleId}
        noValidate
        className="p-8 w-full flex flex-col gap-y-6"
      >
        <h1 id={formTitleId} className="font-bold text-3xl font-inter">
          Set Your Password
        </h1>

        <FieldGroup className="flex flex-col gap-y-4">
          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="flex items-center gap-0"
                  htmlFor={passwordId}
                >
                  Password
                  <span className="text-base text-red-500">*</span>
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id={passwordId}
                  autoComplete="new-password"
                  placeholder="********"
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
                <FieldLabel
                  className="flex items-center gap-0"
                  htmlFor={confirmPasswordId}
                >
                  Confirm Password
                  <span className="text-base text-red-500">*</span>
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id={confirmPasswordId}
                  autoComplete="new-password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex items-center gap-3 w-full">
          <Button
            type="submit"
            disabled={isPending}
            aria-disabled={isPending}
            aria-busy={isPending}
            className="w-full"
          >
            {isPending ? "Registering..." : "Create Account"}
          </Button>
        </div>
      </form>
    </section>
  );
}
