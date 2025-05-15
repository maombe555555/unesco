/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { forbidden } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"
import Project from "@/models/Project"
import { sendEvaluationNotificationEmail } from "@/lib/email/nodemailer"

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

// Update project marks
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    const projectId = params.id
    const { marks, feedback, sendNotification = false } = await req.json()

    // Validate marks
    if (marks !== undefined && (isNaN(marks) || marks < 0 || marks > 100)) {
      return NextResponse.json({ message: "Marks must be a number between 0 and 100" }, { status: 400 })
    }

    const project = await Project.findById(projectId)

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Update marks if provided
    if (marks !== undefined) {
      project.marks = marks
    }

    // Update feedback if provided
    if (feedback !== undefined) {
      project.feedback = feedback
    }

    // Save the updated project
    await project.save()

    // Send notification email if requested
    if (sendNotification) {
      try {
        await sendEvaluationNotificationEmail(
          project.email,
          `${project.contactFirstName} ${project.contactFamilyName}`,
          project._id.toString(),
          project.projectTitle,
          project.marks,
          project.feedback,
        )
      } catch (emailError) {
        console.error("Error sending evaluation notification email:", emailError)
        // Continue even if email fails
      }
    }

    return NextResponse.json(
      {
        message: "Project marks updated successfully",
        project: {
          ...project.toObject(),
          _id: project._id.toString(),
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating project marks:", error)
    return NextResponse.json({ error: "Failed to update project marks" }, { status: 500 })
  }
}
