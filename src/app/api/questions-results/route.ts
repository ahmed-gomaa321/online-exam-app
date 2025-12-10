import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (!token?.accessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_API_BASE}/questions/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token.accessToken,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
