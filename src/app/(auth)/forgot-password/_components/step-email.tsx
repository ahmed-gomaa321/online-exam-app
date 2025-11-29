"use client";

import { sendEmailSchema } from "@/lib/schemes/auth.schemes";
import {
  ForgotPasswordFields,
  SendEmailResponse,
} from "@/lib/types/auth-types/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { UseMutateFunction } from "@tanstack/react-query";
import { saveEmail, startOtpTimer } from "../_utils/otp-timer-presisted";
import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";

type StepEmailProps = {
  setStep: (step: number) => void;
  sendEmail: UseMutateFunction<
    SendEmailResponse,
    Error,
    ForgotPasswordFields,
    unknown
  >;
  isPending: boolean;
  error: Error | null;
};

export default function StepEmail({
  setStep,
  sendEmail,
  isPending,
  error,
}: StepEmailProps) {
  // react hook form
  const form = useForm<ForgotPasswordFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(sendEmailSchema),
  });
  const onSubmit = (data: ForgotPasswordFields) => {
    sendEmail(data, {
      onSuccess: () => {
        saveEmail(data?.email);
        startOtpTimer();
        setStep(2);
      },
      onError: (err) => {
        form.setError("root", { message: err.message, type: "server" });
      },
    });
  };
  return (
    <section className="w-full flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 w-full flex flex-col gap-y-4"
        >
          <h2 className="font-bold text-3xl font-inter">Forgot Password</h2>
          <p className="text-gray-500 mt-2 mb-4">
            Don’t worry, we will help you recover your account.
          </p>
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-inter">Email</FormLabel>
                <FormControl>
                  <Input
                    error={!!error?.message}
                    {...field}
                    placeholder="user@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <ErrorAlert message={error.message} />}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 flex items-center justify-center gap-x-2"
          >
            {isPending ? (
              "Sending..."
            ) : (
              <>
                Continue <MoveRight />
              </>
            )}
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
