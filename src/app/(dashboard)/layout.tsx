import type { Metadata } from "next";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import DashboardHeader from "../_components/dashboard-header";
import DashboardBreadcrumb from "../_components/dashboard-breadcrumb";

export const metadata: Metadata = {
  title: "online-exam",
  description: "manage your exams",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <aside>
        <AppSidebar />
      </aside>
      <div className="flex w-full flex-col items-center gap-2 bg-gray-50">
        <nav className="px-6 flex justify-start w-full items-center gap-2 bg-white">
          <SidebarTrigger />
          <DashboardBreadcrumb />
        </nav>
        <DashboardHeader />
        <main className="w-full px-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
