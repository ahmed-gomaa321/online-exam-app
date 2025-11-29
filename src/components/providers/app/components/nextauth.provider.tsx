"use client";
import { SessionProvider } from "next-auth/react";
type nextauthProviderProps = {
  children: React.ReactNode;
};

export default function NextAuthProvider({ children }: nextauthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
