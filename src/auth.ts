import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import LoginService from "./lib/_actions/auth-services/login.service";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (
        credentials: { username: string; password: string } | undefined,
      ) => {
        if (!credentials) {
          throw new Error("please enter valid credentials.");
        }
        const response = await LoginService({
          username: credentials.username,
          password: credentials.password,
        });

        if (!response.status) {
          throw new Error(response.message || "Failed to authenticate");
        }

        const authData = response?.payload;

        if (!authData?.user || !authData?.token) {
          throw new Error("Invalid payload structure");
        }

        return {
          id: authData.user.id,
          token: authData.token,
          user: authData.user,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, session, trigger }) => {
      if (user) {
        token.token = user.token;
        token.user = user.user;
      }

      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          ...session.user,
        };
      }

      if (trigger === "update" && session?.accessToken) {
        token.token = session.accessToken;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
