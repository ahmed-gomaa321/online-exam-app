import { GraduationCap, UserRound } from "lucide-react";
import finalLogo from "@/../public/assets/images/Final-Logo.png";
import logo from "@/../public/favicon.ico";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants/routes";
import { SidebarUserFooter } from "./sidebare-user-footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Diplomas",
    url: ROUTES.DASHBOARD,
    icon: GraduationCap,
  },
  {
    title: "Account Settings",
    url: ROUTES.ACCOUNT_SETTINGS,
    icon: UserRound,
  },
];

export async function AppSidebar() {
  const session = await getServerSession(authOptions);

  return (
    <Sidebar className="px-10 py-10 bg-blue-50">
      <SidebarHeader>
        <div className="flex flex-col gap-y-3">
          <figure>
            <Image
              src={finalLogo}
              alt="final logo"
              width={192}
              height={37}
              priority
            ></Image>
          </figure>
          <div className="flex items-center">
            <figure>
              <Image src={logo} alt="logo" width={30} height={30}></Image>
            </figure>
            <p className="font-semibold text-xl ms-2 text-blue-600">Exam App</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="mt-14">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem href={item.url} key={item.title}>
                  <div className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserFooter
          firstName={session?.user?.firstName}
          email={session?.user?.email}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
