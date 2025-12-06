import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "4";

  const res = await fetch(
    `${process.env.NEXT_API_BASE}/subjects?page=${page}&limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
        token: token.accessToken,
      },
    }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
