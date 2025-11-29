"use client";

import { ReactNode } from "react";
import { CircleX } from "lucide-react";

type ErrorAlertProps = {
  message: string | ReactNode;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <p
      className="relative text-red-600 text-sm border border-red-600 px-4 py-3 bg-red-50 text-center"
      role="alert"
    >
      <span className="absolute left-1/2 -translate-x-1/2 -top-3 flex items-center justify-center">
        <CircleX className="text-red-600 w-6 h-6 fill-white overflow-hidden" />
      </span>
      {message}
    </p>
  );
}
