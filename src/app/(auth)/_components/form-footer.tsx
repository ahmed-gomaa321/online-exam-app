"use client";

import Link from "next/link";

type FormFooterProps = {
  text: string;
  linkText: string;
  linkHref: string;
};

export default function FormFooter({
  text,
  linkText,
  linkHref,
}: FormFooterProps) {
  return (
    <div className="font-medium flex items-center gap-1 text-sm">
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
