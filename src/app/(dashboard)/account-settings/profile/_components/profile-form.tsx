"use client";

import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect, useId, useState } from "react";
import { ProfileFormFields } from "@/lib/types/account-settings-types/edit-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import useEditProfile from "../../_hooks/use-edit-profile";
import { toast } from "sonner";
import ErrorAlert from "@/app/(auth)/_components/error-alert";
import ConfirmModal from "@/components/shared/confirm-modal";
import useDeleteMyAccount from "../../_hooks/use-delete-my-account";
import { editProfileSchema } from "@/lib/schemes/account-settings.schemes";
import ChangeEmail from "../../_components/change-email";

export default function ProfileForm() {
  // accessibility ids
  const formTitleId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const usernameId = useId();
  const emailId = useId();
  const phoneId = useId();

  // state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // session data
  const { data: session, update } = useSession();

  // react query
  const {
    editProfile,
    isPending: isEditPending,
    error: editError,
  } = useEditProfile(update, session);

  const {
    deleteMyAccount,
    isPending: isDeletePending,
    error: deleteError,
  } = useDeleteMyAccount();

  // react hook form
  const form = useForm<ProfileFormFields>({
    defaultValues: {
      firstName: session?.user?.firstName || "",
      lastName: session?.user?.lastName || "",
      phone: session?.user?.phone || "",
    },
    resolver: zodResolver(editProfileSchema),
  });

  // Display phone formatted for user
  const [displayPhone, setDisplayPhone] = useState<string>(
    session?.user?.phone ? "+20" + session.user.phone.replace(/^0/, "") : "",
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

  // functions
  const handlePhoneChange = (value: string | undefined) => {
    form.setValue("phone", value || "", { shouldDirty: true });
    setDisplayPhone(value || "");
  };

  const onSubmit = (data: ProfileFormFields) => {
    if (!session?.user) return;

    const cleanedPhone = data.phone.replace(/^\+20/, "0");
    const payload: Partial<ProfileFormFields> = {};

    if (data.firstName !== session.user.firstName)
      payload.firstName = data.firstName;
    if (data.lastName !== session.user.lastName)
      payload.lastName = data.lastName;
    if (cleanedPhone !== session.user.phone) payload.phone = cleanedPhone;

    editProfile(payload, {
      onError: (err) => {
        toast.error(err.message);
        form.setError("root", { message: err.message, type: "server" });
      },
    });
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirm = () => {
    deleteMyAccount(undefined, {
      onError: (err) => toast.error(err.message),
    });
    setIsDeleteModalOpen(false);
  };

  return (
    <section className="w-full pb-2">
      <h2 id={formTitleId} className="sr-only">
        Edit Profile
      </h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-labelledby={formTitleId}
        noValidate
        className="w-full flex flex-col gap-y-4"
      >
        <FieldGroup>
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={firstNameId}>First Name</FieldLabel>
                  <Input
                    {...field}
                    id={firstNameId}
                    placeholder="First Name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      aria-live="polite"
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={lastNameId}>Last Name</FieldLabel>
                  <Input
                    {...field}
                    id={lastNameId}
                    placeholder="Last Name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      aria-live="polite"
                    />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Username (Disabled) */}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={usernameId}>Username</FieldLabel>
                <Input
                  {...field}
                  id={usernameId}
                  disabled
                  placeholder="Username"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />

          {/* Email (Read Only) */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={emailId}>Email</FieldLabel>
                  <ChangeEmail />
                </div>
                <Input
                  {...field}
                  id={emailId}
                  readOnly
                  placeholder="Email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={phoneId}>Phone</FieldLabel>
                <PhoneInput
                  id={phoneId}
                  value={displayPhone}
                  onChange={handlePhoneChange}
                  defaultCountry="EG"
                  countrySelectProps={{ disabled: true }}
                  placeholder="Phone number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Error Alerts */}
        {editError && <ErrorAlert message={editError.message} />}
        {deleteError && <ErrorAlert message={deleteError.message} />}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            disabled={isDeletePending}
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="font-medium px-2 bg-red-50 hover:bg-red-100 text-red-600 border-none shadow-none"
          >
            {isDeletePending ? "Deleting..." : "Delete My Account"}
          </Button>
          <Button
            disabled={!form.formState.isDirty || isEditPending}
            type="submit"
            className="font-medium px-2"
          >
            {isEditPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Are you sure you want to delete your account?"
        description="This action is permanent and cannot be undone."
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
