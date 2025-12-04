"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { SlashIcon } from "lucide-react";
import React from "react";

export type BreadcrumbItemType = {
  label: string;
  href?: string;
};

export default function DashboardBreadcrumb() {
  const items = useBreadcrumb();
  const lastIndex = items.length - 1;

  return (
    <Breadcrumb className="p-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem className="cursor-pointer">
              {index !== lastIndex && item.href ? (
                <BreadcrumbLink className="active:scale-90" href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <span className="text-blue-600 text-sm">{item.label}</span>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
