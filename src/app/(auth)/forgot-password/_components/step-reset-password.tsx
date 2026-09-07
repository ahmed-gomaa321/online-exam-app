"use client";
import { ResetPasswordFields } from "@/lib/types/auth-types/forgot-password";
import useResetPassword from "../_hooks/use-reset-password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemes/auth.schemes";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import FormFooter from "../../_components/form-footer";
import ErrorAlert from "../../_components/error-alert";
import { clearSavedEmail, getSavedEmail } from "../_utils/otp-timer-presisted";

export default function StepResetPassword() {
  const router = useRouter();
  // hooks
  const { resetPassword, isPending, error } = useResetPassword();
  // react hook form
  const form = useForm<ResetPasswordFields>({
    defaultValues: {
      email: getSavedEmail() || "",
      newPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit = (data: ResetPasswordFields) => {
    resetPassword(data, {
      onSuccess: () => {
        router.push(ROUTES.LOGIN);
        toast.success("Password reset successful! Please login.");
        clearSavedEmail();
      },
      onError: (err) => {
        form.setError("root", { message: err.message, type: "server" });
      },
    });
  };
  return (
    <section className="flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 w-full flex flex-col gap-y-4"
        >
          <h2 className="font-bold text-gray-800 lg:text-3xl font-inter">
            Create a New Password
          </h2>
          <p className="text-gray-500 text-sm lg:text-base lg:mb-10">
            Create a new strong password for your account.
          </p>
          {/* password field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>New Password</FormLabel>
                <PasswordInput
                  error={!!form.formState.errors.newPassword}
                  {...field}
                  placeholder="********"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* re-password field */}
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Confirm New Password</FormLabel>
                <PasswordInput
                  error={!!form.formState.errors.confirmNewPassword}
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
            {isPending ? "Resetting..." : "Reset Password"}
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
