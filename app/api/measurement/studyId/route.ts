import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const studyId = process.env.STUDY_ID;

  if (!studyId) {
    return NextResponse.json(
      { status: "500", error: "STUDY_ID not configured" },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "200", studyId });
}
