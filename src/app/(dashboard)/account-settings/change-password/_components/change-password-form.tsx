"use client";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { changePasswordSchema } from "@/lib/schemes/change-password.schemes";
import { changePasswordFiels } from "@/lib/types/account-settings-types/change-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useChangePassword from "../../_hooks/use-change-password";
import { toast } from "sonner";
import ErrorAlert from "@/app/(auth)/_components/error-alert";
import { signOut, useSession } from "next-auth/react";

export default function ChangePasswordForm() {
  const { update } = useSession();
  // react query
  const { changePassword, isPending, error } = useChangePassword();

  //   react hook form
  const form = useForm<changePasswordFiels>({
    defaultValues: {
      oldPassword: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  // functions
  const onSubmit = (data: changePasswordFiels) => {
    changePassword(data, {
      onSuccess: async (res) => {
        toast.success("Password changed successfully!");
        form.reset();
        await update({
          accessToken: res.token,
        });
        setTimeout(() => window.location.reload(), 2000);
      },

      onError: (err) => {
        toast.dismiss();
        toast.error(err.message),
          form.setError("root", { message: err.message, type: "server" });
      },
    });
  };
  return (
    <section className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-y-4"
        >
          {/* Old Password */}
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className=" border-b pb-6">
                <FormLabel>Current Password</FormLabel>
                <PasswordInput
                  error={!!form.formState.errors.oldPassword}
                  {...field}
                  placeholder="********"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* New Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <PasswordInput
                  error={!!form.formState.errors.password}
                  {...field}
                  placeholder="********"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="rePassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <PasswordInput
                  error={!!form.formState.errors.rePassword}
                  {...field}
                  placeholder="********"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error */}
          {error && <ErrorAlert message={"Something went wrong"} />}

          {/* Buttons */}
          <Button disabled={isPending} className="font-medium px-2 mt-8">
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </section>
  );
}
