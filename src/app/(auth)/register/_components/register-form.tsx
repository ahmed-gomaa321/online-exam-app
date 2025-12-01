"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/schemes/auth.schemes";
import { RegisterFields } from "@/lib/types/auth-types/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import useRegister from "../_hooks/use-register";
import { useForm } from "react-hook-form";
import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";

export default function RegisterForm() {
  const { register, isPending, error } = useRegister();
  //  react hook form
  const form = useForm<RegisterFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    resolver: zodResolver(registerSchema),
  });

  //   submit handler
  const onSubmit = (data: RegisterFields) => {
    const payload = {
      ...data,
      phone: data.phone.replace(/\s+/g, "").replace(/^(?:\+?20|0020)/, "0"),
    };
    register(payload, {
      onError: (err) => {
        form.setError("root", { message: err.message, type: "server" });
      },
    });
  };

  return (
    <section className="pt-36 flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 w-full max-w-xl flex flex-col gap-y-4"
        >
          <h2 className="font-bold text-3xl font-inter">Create Account</h2>
          {/* first name & last name */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      error={!!form.formState.errors.firstName}
                      {...field}
                      placeholder="first name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      error={!!form.formState.errors.lastName}
                      {...field}
                      placeholder="last name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    error={!!form.formState.errors.username}
                    {...field}
                    placeholder="user123"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* email */}
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
          {/* phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="EG"
                    countrySelectProps={{ disabled: true }}
                    error={!!form.formState.errors.phone}
                    placeholder="phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* password */}
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
              </FormItem>
            )}
          />
          {/* re-password */}
          <FormField
            control={form.control}
            name="rePassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Confirm Password</FormLabel>
                <PasswordInput
                  error={!!form.formState.errors.password}
                  {...field}
                  placeholder="********"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <ErrorAlert message={error.message} />}

          <Button
            type="submit"
            disabled={isPending}
            className={`mt-4 w-full font-medium py-2`}
          >
            {isPending ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </Form>
      <FormFooter
        text="Already have an account?"
        linkText="Login"
        linkHref={ROUTES.LOGIN}
      />
    </section>
  );
}
