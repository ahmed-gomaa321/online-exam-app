import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        { status: false, message: "Diploma ID is missing" },
        { status: 400 },
      );
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    const rawToken = token?.token || token?.accessToken;

    if (!rawToken || typeof rawToken !== "string") {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const res = await fetch(`${process.env.NEXT_API_BASE}/diplomas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${rawToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("--> Route Handler Error:", error);
    return NextResponse.json(
      { status: false, message: error?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
