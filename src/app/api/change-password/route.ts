import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await fetch(
      `${process.env.NEXT_API_BASE}/auth/changePassword`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: token.accessToken,
        },
        body: JSON.stringify(body),
      }
    );

    const text = await res.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || "Unknown error" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Change password failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
