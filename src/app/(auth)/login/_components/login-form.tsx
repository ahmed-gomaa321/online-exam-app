"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "../_hooks/use-login";
import { LoginFields } from "@/lib/types/auth-types/login";
import { ROUTES } from "@/lib/constants/routes";
import { loginSchema } from "@/lib/schemes/auth.schemes";
import { PasswordInput } from "@/components/shared/password-input";
import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useId } from "react";
import Link from "next/link";

export default function LoginForm() {
  // unique ids for accessibility
  const formTitleId = useId();
  const usernameId = useId();
  const passwordId = useId();

  // hooks
  const { login, isPending, error } = useLogin();
  //  react hook form
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // submit handler
  const onSubmit = (data: LoginFields) => {
    login(data, {
      onError: (err) => {
        form.setError("root", { message: err.message, type: "server" });
      },
    });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-labelledby={formTitleId}
        noValidate
        className="p-8 w-full max-w-md flex flex-col gap-y-4"
      >
        <h1 id={formTitleId} className="font-bold text-3xl font-inter">
          Login
        </h1>
        <FieldGroup>
          {/* username field */}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={usernameId}>Username</FieldLabel>
                <Input
                  {...field}
                  autoFocus
                  ref={field.ref}
                  id={usernameId}
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="User123"
                  autoComplete="username"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Password field */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
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
          <Link
            className="ms-auto text-blue-500 hover:text-blue-600 font-medium text-sm"
            href={ROUTES.FORGOT_PASSWORD}
          >
            Forgot your password?
          </Link>
        </FieldGroup>

        {error && <ErrorAlert message={"wrong username or password"} />}

        <Button
          type="submit"
          disabled={isPending}
          className={`mt-4 w-full font-medium py-2`}
        >
          {isPending ? "Logging in..." : "Login"}
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
