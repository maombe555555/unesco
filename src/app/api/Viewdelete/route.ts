import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import Application from "@/models/Myapplication";
import Viewdelete from "@/models/Viewdelete";
export async function GET() {
  try {
    await dbConnect();
    // Get total applications count
    const totalApplications = await Application.countDocuments();
    // Get applications by status
    const pendingApplications = await Application.countDocuments({ status: "pending" });
    const acceptedApplications = await Application.countDocuments({ status: "accepted" });
    const rejectedApplications = await Application.countDocuments({ status: "rejected" });
    // Get total users/applicants count
    const totalUsers = await Viewdelete.countDocuments({ role: "applicant" });
    // Calculate completion rate
    const completionRate = totalApplications > 0 
      ? ((acceptedApplications + rejectedApplications) / totalApplications * 100).toFixed(2)
      : 0;
    const dashboardStats = {
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      totalUsers,
      completionRate
    };
    return NextResponse.json(dashboardStats, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}