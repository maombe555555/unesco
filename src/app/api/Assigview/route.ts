
import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import Assigview from "@/models/Assigview";
// POST /api/projects
export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Parse the incoming request body
    const { title, applicantName, marks } = await request.json();
    // Basic validation
    if (!title || !applicantName) {
      return NextResponse.json(
        { message: "Title and Applicant Name must be provided." },
        { status: 400 }
      );
    }
    // Create a new project instance
    const project = new Assigview({
      title,
      applicantName,
      marks: marks || 0,
    });
    // Save the project to the database
    await project.save();
    return NextResponse.json(
      { message: "Project created successfully!", project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// GET /api/projects
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    // Find all projects in the database.
    const projects = await Assigview.find({});
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}