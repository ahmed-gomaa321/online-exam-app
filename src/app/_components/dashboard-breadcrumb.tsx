import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import React from "react";

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

interface DashboardBreadcrumbProps {
  items: BreadcrumbItemType[];
}

export default function DashboardBreadcrumb({
  items,
}: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb className="p-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <span className="text-blue-600 font-medium">{item.label}</span>
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
