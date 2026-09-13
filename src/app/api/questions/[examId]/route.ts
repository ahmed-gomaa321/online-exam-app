import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    examId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { examId } = await params;

    if (!examId || examId === "undefined") {
      return NextResponse.json(
        { message: "Exam ID is missing" },
        { status: 400 },
      );
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    const rawToken = token?.token;

    if (!rawToken || typeof rawToken !== "string") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_API_BASE}/questions/exam/${examId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${rawToken}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
