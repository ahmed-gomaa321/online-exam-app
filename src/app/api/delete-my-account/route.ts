import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  if (!token?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }
  const res = await fetch(`${process.env.NEXT_API_BASE}/auth/deleteMe`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: token.accessToken,
    },
  });
  const data = await res.json();
  return NextResponse.json(data, {
    status: res.status,
  });
}
