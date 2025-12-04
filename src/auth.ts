import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import LoginService from "./lib/_actions/auth-services/login.service";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (
        credentials: { email: string; password: string } | undefined
      ) => {
        if (!credentials) {
          throw new Error("please enter valid credentials.");
        }
        const payload = await LoginService({
          email: credentials.email,
          password: credentials.password,
        });
        if ("code" in payload) {
          throw new Error(payload.message);
        }
        return {
          id: payload.user._id,
          accessToken: payload.token,
          user: payload.user,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, session, trigger }) => {
      //  update session immediate when use update function from useSession()
      if (trigger === "update" && session.user) {
        return { ...token, ...session };
      }
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user;
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
