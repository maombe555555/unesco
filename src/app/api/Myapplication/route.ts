import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import Application from "@/models/Myapplication";
export async function GET(request: Request) {
  try {
    // Get userId from URL parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }
    await dbConnect();
    const application = await Application.findOne({ userId });
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      { error: "Failed to fetch application status" },
      { status: 500 }
    );
  }
}