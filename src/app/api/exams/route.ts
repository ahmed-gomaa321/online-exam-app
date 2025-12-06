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

  const res = await fetch(`${process.env.NEXT_API_BASE}/exams`, {
    headers: {
      "Content-Type": "application/json",
      token: token.accessToken,
    },
  });
  try {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error }, { status: res.status });
  }
}
