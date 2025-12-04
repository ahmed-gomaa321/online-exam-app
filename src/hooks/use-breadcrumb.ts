"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";
import { ExamNameContext } from "@/components/providers/app/components/exam-name-context";
import { ROUTES } from "@/lib/constants/routes";

export type BreadcrumbItemType = {
  label: string;
  href?: string;
};

export function useBreadcrumb(): BreadcrumbItemType[] {
  const pathname = usePathname();
  const { examName } = useContext(ExamNameContext);

  const breadcrumbMap: Record<string, string> = {
    [ROUTES.ACCOUNT_SETTINGS]: "Account",
  };

  const breadcrumbs: BreadcrumbItemType[] = [
    { label: "Home", href: ROUTES.DASHBOARD },
  ];

  const slugs = pathname.split("/").filter(Boolean);

  if (pathname === ROUTES.DASHBOARD) {
    return [{ label: "Home" }];
  }

  let path = "";

  slugs.forEach((slug, index) => {
    path += `/${slug}`;
    const isLast = index === slugs.length - 1;

    // exam page
    if (slugs[0] === "exams" && index === 1 && examName) {
      breadcrumbs.push({
        label: examName,
        href: ROUTES.EXAMS,
      });
      return;
    }

    // questions page
    if (slugs[0] === "exams" && index === 2 && slugs[2] === "questions") {
      breadcrumbs.push({ label: "Questions" });
      return;
    }

    if (breadcrumbMap[path]) {
      breadcrumbs.push({
        label: breadcrumbMap[path],
        href: isLast ? undefined : path,
      });
      return;
    }

    // fallback for other slugs
    const formatted = slug
      .replace(/-/g, " ")
      .split(" ")[0]
      .replace(/^\w/, (c) => c.toUpperCase());

    breadcrumbs.push({
      label: formatted,
      href: isLast ? undefined : path,
    });
  });

  return breadcrumbs;
}
