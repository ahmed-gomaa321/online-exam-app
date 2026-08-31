import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      profilePhoto: string;
      emailVerified: boolean;
      phoneVerified: boolean;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends Pick<User, "user"> {
    user: User["user"];
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User {}
}
