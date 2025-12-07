"use client";

import { useHeaderTitle } from "@/hooks/use-header-title";
import { ROUTES } from "@/lib/constants/routes";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardHeader() {
  const item = useHeaderTitle();
  const pathname = usePathname();
  const router = useRouter();

  const showBackButton = pathname !== ROUTES.DASHBOARD;
  return (
    <header className="flex w-full items-center p-6 gap-3 text-white">
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="text-sm px-1 py-6 border border-blue-600"
          aria-label="Go back"
        >
          <ChevronLeft className="text-blue-600 font-normal" />
        </button>
      )}
      <div className="flex items-center gap-2 p-4 bg-blue-600 w-full">
        {<item.icon className="size-11" />}
        <h1 className="text-xs md:text-base xl:text-3xl font-semibold font-inter">
          {item.title}
        </h1>
      </div>
    </header>
  );
}
