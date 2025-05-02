import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import View from "@/models/View"; // Assuming you have a Project model
export async function GET() {
  try {
    // Connect to database
    await dbConnect();
    
    // Fetch all projects
    const projects = await View.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .select('-__v'); // Exclude version key
    
    return NextResponse.json(
      { 
        success: true, 
        data: projects 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch projects" 
      }, 
      { status: 500 }
    );
  }
}
// Get a single project by ID
export async function GET_BY_ID(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Project ID is required" 
        }, 
        { status: 400 }
      );
    }
    await dbConnect();
    const project = await View.findById(id).select('-__v');
    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Project not found" 
        }, 
        { status: 404 }
      );
    }
    return NextResponse.json(
      { 
        success: true,  
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch project" 
      }, 
      { status: 500 }
    );
  }
}