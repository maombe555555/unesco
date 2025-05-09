import Application from "@/models/Application";
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
      throw new Error("Token not found");
    }

    const body = await request.json();
    const { status } = applicationSchema.parse(body);
    await dbConnect();
    const payload = await decrypt(token!);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;
    const applicationData = new Application({
      userId,
      status,
    });
    await applicationData.save();
    return NextResponse.json(
      { message: "Application created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during application creation:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      throw new Error("Token not found");
    }

    await dbConnect();
    const payload = await decrypt(token!);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;

    console.log("User ID from token:", userId);
    const applicationData = await Application.find({ userId });
    return NextResponse.json(applicationData, { status: 200 });
  } catch (error) {
    console.error("Error during application retrieval:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      throw new Error("Token not found");
    }

    const body = await request.json();
    const { status } = applicationSchema.parse(body);
    await dbConnect();
    const payload = await decrypt(token!);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;
    const applicationData = await Application.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    );
    if (!applicationData) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Application updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during application update:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      throw new Error("Token not found");
    }

    await dbConnect();
    const payload = await decrypt(token!);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;
    const applicationData = await Application.findOneAndDelete({ userId });
    if (!applicationData) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during application deletion:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
