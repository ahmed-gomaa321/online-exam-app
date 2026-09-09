"use client";

import Link from "next/link";

type FormFooterProps = {
  className?: string;
  text: string;
  linkText: string;
  linkHref: string;
};

export default function FormFooter({
  text,
  linkText,
  linkHref,
  className,
}: FormFooterProps) {
  return (
    <div
      className={`font-medium flex items-center justify-center gap-1 text-xs sm:text-sm ${className || ""}`}
    >
      <p className="text-gray-500">{text}</p>
      <Link
        href={linkHref}
        className="text-blue-600 hover:text-blue-700 transition cursor-pointer active:scale-90"
      >
        {linkText}
      </Link>
    </div>
  );
}
