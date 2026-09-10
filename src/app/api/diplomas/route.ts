import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const rawToken = token?.token;

  if (!rawToken || typeof rawToken !== "string") {
    return NextResponse.json(
      { status: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req?.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "4";

  const res = await fetch(
    `${process.env.NEXT_API_BASE}/diplomas?page=${page}&limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${rawToken}`,
      },
    },
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res?.status });
}
