/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { forbidden } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"
import Project from "@/models/Project"

// Function to verify if the current user is an applicant
async function verifyAccess(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  // Check if the user has role
  if (session.role !== "applicant") {
    forbidden()
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect()
  await verifyAccess(req)

  try {
    const session = await getSession()
    const userEmail = session?.email

    if (!userEmail) {
      return NextResponse.json({ message: "User email not found in session." }, { status: 400 })
    }

    const projectId = params.id

    // Find the project by ID and ensure it belongs to the current user
    const project = await Project.findOne({
      _id: projectId,
      email: userEmail,
    }).lean() as { _id: any; createdAt: Date; updatedAt: Date } | null

    if (!project) {
      return NextResponse.json(
        { message: "Project not found or you don't have permission to view it." },
        { status: 404 },
      )
    }

    // Convert MongoDB document to plain object and ensure _id is properly serialized
    const serializedProject = {
      ...project,
      _id: project._id?.toString?.() ?? "",
      createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : "",
      updatedAt: project.updatedAt instanceof Date ? project.updatedAt.toISOString() : "",
    }

    return NextResponse.json({ project: serializedProject }, { status: 200 })
  } catch (error) {
    console.error("Error fetching project:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ message: "Failed to fetch project.", error: errorMessage }, { status: 500 })
  }
}
