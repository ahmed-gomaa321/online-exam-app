"use client";

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  personInfoData,
  registerStep3Schema,
} from "@/lib/schemes/auth.schemes";

type Props = {
  setStep: (step: 1 | 2 | 3 | 4) => void;
};

export default function PersonalInfo({ setStep }: Props) {
  //   uniq Ids
  const formTitleId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const usernameId = useId();
  const phoneId = useId();

  // React Hook Form
  const form = useForm<personInfoData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
    },
    resolver: zodResolver(registerStep3Schema),
  });

  const onSubmit = (data: personInfoData) => {
    localStorage.setItem("personal-info", JSON.stringify(data));
    setStep(4);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        aria-labelledby={formTitleId}
        noValidate
        className="p-8 flex flex-col gap-y-4"
      >
        <h2 id={formTitleId} className="font-bold text-3xl font-inter">
          Create Account
        </h2>
        <h2 className="font-bold text-3xl font-inter text-blue-600">
          Tell us more about you
        </h2>
        <FieldGroup className="flex flex-col gap-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="flex items-center gap-0"
                    htmlFor={firstNameId}
                  >
                    First Name
                    <span className="text-base text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={firstNameId}
                    type="text"
                    autoComplete="given-name"
                    placeholder="first name"
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
                  <FieldLabel
                    className="flex items-center gap-0"
                    htmlFor={lastNameId}
                  >
                    Last Name
                    <span className="text-base text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={lastNameId}
                    type="text"
                    autoComplete="family-name"
                    placeholder="last name"
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

          {/* Username */}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="flex items-center gap-0"
                  htmlFor={usernameId}
                >
                  Username
                  <span className="text-base text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={usernameId}
                  type="text"
                  autoComplete="username"
                  placeholder="user123"
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
            render={({ field, fieldState }) => (
              <Field className="mb-8" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={phoneId}>Phone</FieldLabel>
                <PhoneInput
                  {...field}
                  id={phoneId}
                  defaultCountry="EG"
                  countrySelectProps={{ disabled: true }}
                  placeholder="phone number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} aria-live="polite" />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          variant="outline"
          type="submit"
          disabled={form.formState.isSubmitting}
          aria-disabled={form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            "Sending..."
          ) : (
            <span className="flex justify-center items-center gap-1">
              Next <ChevronRight aria-hidden="true" />
            </span>
          )}
        </Button>
      </form>
    </section>
  );
}
