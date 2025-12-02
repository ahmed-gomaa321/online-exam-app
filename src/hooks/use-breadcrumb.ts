"use client";
import { ROUTES } from "@/lib/constants/routes";
import { usePathname } from "next/navigation";

export function useBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbItems: Record<string, string> = {
    [ROUTES.DASHBOARD]: "Home",
    [ROUTES.ACCOUNT_SETTINGS]: "Account Settings",
  };

  const slugs = pathname.split("/").filter(Boolean);
  let path = "";
  return slugs.map((slug, index) => {
    path += `/${slug}`;
    const isLast = index === slugs.length - 1;
    return {
      label: breadcrumbItems[path] ?? slug,
      href: isLast ? undefined : path,
    };
  });
}
