"use client";

import { useState, useId } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function PasswordInput({
  error,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const generatedId = useId();
  const inputId = id || generatedId;
  const toggleHintId = `${inputId}-toggle-hint`;

  return (
    <div className="relative flex items-center w-full">
      <Input
        {...props}
        id={inputId}
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        aria-invalid={ariaInvalid ?? error}
        aria-describedby={
          [ariaDescribedBy, toggleHintId].filter(Boolean).join(" ") || undefined
        }
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
        aria-controls={inputId}
      >
        {showPassword ? (
          <EyeOff size={18} aria-hidden="true" />
        ) : (
          <Eye size={18} aria-hidden="true" />
        )}
      </button>

      <span id={toggleHintId} className="sr-only">
        {showPassword ? "Password visible" : "Password hidden"}
      </span>
    </div>
  );
}
