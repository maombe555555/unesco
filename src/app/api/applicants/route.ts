import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import Applicant from "@/models/Applicant";
import { decrypt } from "@/lib/utils/sessionutil";
import { cookies } from "next/headers";
import { z } from "zod";
// Define the input schema using Zod for validation.
export const applicantSchema = z.object({
  budgetData: z.object({
    category1Explanation: z.string().optional(),
    category1Cost: z.number().optional(),
    category2Explanation: z.string().optional(),
    category2Cost: z.number().optional(),
    category3Explanation: z.string().optional(),
    category3Cost: z.number().optional(),
    category4Explanation: z.string().optional(),
    category4Cost: z.number().optional(),
    category5Explanation: z.string().optional(),
    category5Cost: z.number().optional(),
    category6Explanation: z.string().optional(),
    category6Cost: z.number().optional(),
  }),
  selectedFiles: z.array(z.string()).optional(),
  moreInfoFile: z.string().optional(),
  submittedAt: z.date().optional(),
});
// Helper function to retrieve and validate the token.
async function getToken(request: Request): Promise<{ token?: string; payload?: any; error?: string }> {
  try {
    // Await cookies() since it returns a promise in Next.js 13.
    const cookieStore = await cookies();
    // First, try to get the token from the cookie named "session"
    let token = cookieStore.get("session")?.value;
    // If not found, try to get it from the Authorization header.
    if (!token) {
      token = request.headers.get("authorization")?.replace("Bearer ", "");
    }
    // Modify the message if token is not found.
    if (!token) {
      return { error: "The authentication token is missing from your request. Please login and try again." };
    }
    // Decrypt (or verify) the token.
    const payload = await decrypt(token);
    if (!payload || !payload.userId) {
      return { error: "Invalid token" };
    }
    return { token, payload };
  } catch (err: any) {
    return { error: err.message || "Token handling error" };
  }
}
// POST: Create a new applicant record in MongoDB.
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { error: tokenError, payload } = await getToken(request);
    if (tokenError) {
      return NextResponse.json({ message: tokenError }, { status: 401 });
    }
    const body = await request.json();
    const parsedBody = applicantSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid request data", details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }
    // Create a new Applicant document including the authenticated user's ID.
    const applicationData = new Applicant({
      userId: payload.userId,
      ...parsedBody.data,
    });
    console.log("Authenticated payload for POST:", payload);
    await applicationData.save();
    return NextResponse.json({ message: "Application created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || error },
      { status: 500 }
    );
  }
}
// GET: Retrieve all applicant records for the authenticated user.
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { error: tokenError, payload } = await getToken(request);
    if (tokenError) {
      return NextResponse.json({ message: tokenError }, { status: 401 });
    }
    // Query database for all application records for this user.
    const applicationData = await Applicant.find({ userId: payload.userId });
    return NextResponse.json(applicationData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || error },
      { status: 500 }
    );
  }
}
// DELETE: Delete all applicant records for the authenticated user.
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    
    const { error: tokenError, payload } = await getToken(request);
    if (tokenError) {
      return NextResponse.json({ message: tokenError }, { status: 401 });
    }
    await Applicant.deleteMany({ userId: payload.userId });
    return NextResponse.json({ message: "Applications deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting applications:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || error },
      { status: 500 }
    );
  }
}