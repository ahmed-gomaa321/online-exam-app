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
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ProfileFormFields } from "@/lib/types/account-settings-types/edit-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/lib/schemes/account-settings.schemes";
import useEditProfile from "../../_hooks/use-edit-profile";
import { toast } from "sonner";
import ErrorAlert from "@/app/(auth)/_components/error-alert";

export default function ProfileForm() {
  // session data
  const { data: session, update } = useSession();

  //   react query
  const { editProfile, isPending, error } = useEditProfile(update, session);

  // react hook form
  const form = useForm<ProfileFormFields>({
    defaultValues: {
      firstName: session?.user?.firstName || "",
      lastName: session?.user?.lastName || "",
      username: session?.user?.username || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
    },
    resolver: zodResolver(editProfileSchema),
  });

  // Display phone formatted for user
  const [displayPhone, setDisplayPhone] = useState<string>(
    session?.user?.phone ? "+20" + session.user.phone.replace(/^0/, "") : ""
  );

  // Reset form when session changes
  useEffect(() => {
    if (session?.user) {
      const formattedPhone = session.user.phone
        ? "+20" + session.user.phone.replace(/^0/, "")
        : "";

      form.reset({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        username: session.user.username || "",
        email: session.user.email || "",
        phone: formattedPhone || "",
      });

      setDisplayPhone(formattedPhone);
    }
  }, [session?.user, form]);

  //   functions
  const handlePhoneChange = (value: string | undefined) => {
    // Keep E.164 for form value
    form.setValue("phone", value || "");
    setDisplayPhone(value || "");
  };

  const onSubmit = (data: ProfileFormFields) => {
    if (!session?.user) return;

    // Convert phone back to local format for backend
    const cleanedPhone = data.phone.replace(/^\+20/, "0");

    const payload: Partial<ProfileFormFields> = {};

    if (data.firstName !== session.user.firstName)
      payload.firstName = data.firstName;
    if (data.lastName !== session.user.lastName)
      payload.lastName = data.lastName;
    if (data.username !== session.user.username)
      payload.username = data.username;
    if (data.email !== session.user.email) payload.email = data.email;
    if (cleanedPhone !== session.user.phone) payload.phone = cleanedPhone;

    // send request from use hook
    editProfile(payload, {
      onError: (err) => {
        toast.error(err.message);
        form.setError("root", { message: err.message, type: "server" });
      },
    });
  };

  return (
    <section className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-y-3"
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      error={!!form.formState.errors.firstName}
                      {...field}
                      placeholder="First Name"
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
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      error={!!form.formState.errors.lastName}
                      {...field}
                      placeholder="Last Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    error={!!form.formState.errors.username}
                    {...field}
                    placeholder="Username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    error={!!form.formState.errors.email}
                    {...field}
                    placeholder="Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={() => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    error={!!form.formState.errors.phone}
                    value={displayPhone}
                    onChange={handlePhoneChange}
                    defaultCountry="EG"
                    countrySelectProps={{ disabled: true }}
                    placeholder="Phone number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Error */}
          {error && <ErrorAlert message={error.message} />}
          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button className="font-medium py-2 bg-red-50 hover:bg-red-100 text-red-600">
              Delete My Account
            </Button>
            <Button
              disabled={!form.formState.isDirty || isPending}
              type="submit"
              className="font-medium py-2"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
