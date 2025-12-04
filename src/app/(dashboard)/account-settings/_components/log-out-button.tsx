"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogOutButton() {
  const handleClick = () => signOut();
  return (
    <span
      onClick={handleClick}
      className="cursor-pointer mt-2 xl:mt-0 flex items-center gap-2 w-full p-4 text-start bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
    >
      <LogOut className="w-6 h-6" /> Logout
    </span>
  );
}
