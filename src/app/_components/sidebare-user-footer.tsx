"use client";

import { EllipsisVertical, LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import profile from "@/../public/assets/images/profile-photo.jpg";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/constants/routes";
import { useRouter } from "next/navigation";

type DropDownItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  textColor?: string;
};
type SidebarUserFooterProps = {
  firstName?: string;
  email?: string;
};
export function SidebarUserFooter({
  firstName,
  email,
}: SidebarUserFooterProps) {
  // hooks
  const session = useSession();
  const router = useRouter();
  // components items
  const dropDownItems: DropDownItem[] = [
    {
      label: "Account",
      icon: <UserRound className="mr-2 h-6 w-6 text-gray-500" />,
      onClick: () => router.push(ROUTES.ACCOUNT_SETTINGS),
      textColor: "text-gray-800",
    },
    {
      label: "Logout",
      icon: <LogOut className="mr-2 h-6 w-6 text-red-400" />,
      onClick: () => signOut(),
      textColor: "text-red-600",
    },
  ];
  return (
    <div className="flex items-center justify-between ps-0 p-4">
      <div className="flex items-center gap-3">
        {/* Profile Picture */}
        <figure className="size-[54px] overflow-hidden relative border border-blue-600">
          <Image
            src={profile}
            alt="User"
            fill
            className="object-cover object-[center_15%]"
          />
        </figure>

        {/* Name + Email */}
        <div className="flex flex-col">
          <span className="font-semibold text-blue-600">
            {session?.data?.user?.firstName ?? firstName}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[9rem] truncate text-sm text-gray-500">
                  {session?.data?.user?.email ?? email}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-blue-500 text-white py-2 px-3 rounded-none"
              >
                <p className="text-sm">{session?.data?.user?.email ?? email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 focus-visible:outline-none">
            <EllipsisVertical className="h-5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {dropDownItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              className="cursor-pointer"
            >
              {item.icon}
              <span className={`text-sm ${item.textColor}`}>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
