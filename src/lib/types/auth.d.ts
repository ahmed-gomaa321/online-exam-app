import { User } from "next-auth";

// declare types for login payload
export type LoginPayload = {
  token: string;
  user: User["user"];
};

export type RegisterPayload = {
  token: string;
  user: User["user"];
};
