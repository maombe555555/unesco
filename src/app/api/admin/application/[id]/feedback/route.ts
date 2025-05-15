/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { forbidden } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"
import Project from "@/models/Project"

// Function to verify if the current user is an admin
async function verifyAdminAccess(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  if (session.role !== "admin") {
    forbidden()
  }
}

// Update application feedback and marks
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    const applicationId = params.id
    const { feedback, marks } = await req.json()

    const application = await Project.findById(applicationId)

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Update feedback if provided
    if (feedback !== undefined) {
      application.feedback = feedback
    }

    // Update marks if provided
    if (marks !== undefined) {
      application.marks = marks
    }

    await application.save()

    return NextResponse.json(
      {
        message: "Application feedback updated successfully",
        application: {
          ...application.toObject(),
          _id: application._id.toString(),
          createdAt: application.createdAt.toISOString(),
          updatedAt: application.updatedAt.toISOString(),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating application feedback:", error)
    return NextResponse.json({ error: "Failed to update application feedback" }, { status: 500 })
  }
}
