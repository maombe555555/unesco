/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { forbidden } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"
import Project from "@/models/Project"
import { sendStatusUpdateEmail } from "@/lib/email/nodemailer"

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

// Update application status
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    const applicationId = params.id
    const { status, feedback, marks } = await req.json()

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 })
    }

    const application = await Project.findById(applicationId)

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Update the application status
    application.status = status

    // Update feedback and marks if provided
    if (feedback !== undefined) {
      application.feedback = feedback
    }

    if (marks !== undefined) {
      application.marks = marks
    }

    await application.save()

    // Send email notification to the applicant
    try {
      await sendStatusUpdateEmail(
        application.email,
        `${application.contactFirstName} ${application.contactFamilyName}`,
        applicationId,
        application.projectTitle,
        status,
        feedback,
      )
    } catch (emailError) {
      console.error("Error sending status update email:", emailError)
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        message: "Application status updated successfully",
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
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
  }
}
