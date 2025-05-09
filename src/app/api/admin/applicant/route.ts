import Application from "@/models/Applicant";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/utils/sessionutil";
import { applicationSchema } from "@/lib/validations/application";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }
    const body = await request.json();
    const { status } = applicationSchema.parse(body);
    await dbConnect();
    const payload = await decrypt(token);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const { userId, role } = payload;
    if (role !== "admin") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
    }
    const applicationData = new Application({ userId, status });
    await applicationData.save();
    return NextResponse.json({ message: "Application created successfully" }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during application creation:", error.message);
    } else {
      console.error("Error during application creation:", error);
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }
    await dbConnect();
    const payload = await decrypt(token);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const { role } = payload;
    if (role !== "admin") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
    }
    const applications = await Application.find({ userId: payload.userId });
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during application retrieval:", error.message);
    } else {
      console.error("Error during application retrieval:", error);
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }
    const body = await request.json();
    const { applicationId, status } = applicationSchema.parse(body);
    await dbConnect();
    const payload = await decrypt(token);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const { role } = payload;
    if (role !== "admin") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
    }
    const applicationData = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (!applicationData) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Application updated successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during application update:", error.message);
    } else {
      console.error("Error during application update:", error);
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}