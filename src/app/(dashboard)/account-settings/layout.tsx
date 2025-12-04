import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants/routes";
import { CircleUserRound, Lock } from "lucide-react";
import type { Metadata } from "next";
import LogOutButton from "./_components/log-out-button";

export const metadata: Metadata = {
  title: "online-exam | Account Settings",
  description: "Manage your account settings",
};

export default async function AccountSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accountSettingsItems = [
    {
      icon: <CircleUserRound className="w-6 h-6" />,
      label: "Profile",
      href: ROUTES.PROFILE,
    },
    {
      icon: <Lock className="w-6 h-6" />,
      label: "Change Password",
      href: ROUTES.CHANGE_PASSWORD,
    },
  ];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 xl:gap-4 h-full w-full">
      <aside className="bg-white p-6 col-span-3 xl:col-span-1 xl:h-full h-fit flex flex-col xl:justify-between items-start">
        <SidebarMenu>
          {accountSettingsItems.map((item) => (
            <SidebarMenuItem className="p-3" href={item.href} key={item.label}>
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <LogOutButton />
      </aside>
      <main className="bg-white p-6 col-span-3 overflow-auto max-h-[calc(100vh-224px)]">
        {children}
      </main>
    </div>
  );
}
