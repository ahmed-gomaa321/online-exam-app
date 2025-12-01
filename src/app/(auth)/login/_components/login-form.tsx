"use client";

import { CircleX, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "../_hooks/use-login";
import { LoginFields } from "@/lib/types/auth-types/login";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { loginSchema } from "@/lib/schemes/auth.schemes";
import { PasswordInput } from "@/components/shared/password-input";
import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";

export default function LoginForm() {
  // hooks
  const { login, isPending, error } = useLogin();
  //  react hook form
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 w-full max-w-md flex flex-col gap-y-4"
        >
          <h2 className="font-bold text-3xl font-inter">Login</h2>
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    error={!!form.formState.errors.email}
                    {...field}
                    placeholder="user@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Password</FormLabel>
                <PasswordInput
                  error={!!form.formState.errors.password}
                  {...field}
                  placeholder="********"
                />
                <FormMessage />
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-blue-600 hover:text-blue-700 transition text-sm font-medium cursor-pointer self-end tracking-normal active:scale-90"
                >
                  Forgot your password?
                </Link>
              </FormItem>
            )}
          />
          {error && <ErrorAlert message={"wrong email or password"} />}

          <Button
            type="submit"
            disabled={isPending}
            className={`mt-4 w-full font-medium py-2`}
          >
            {isPending ? "Logging in..." : "Login"}
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
