/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Get a single application by ID
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    const applicationId = params.id
    const application = await Project.findById(applicationId).lean() as (Record<string, any> | null)

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Convert MongoDB document to plain object and ensure _id is properly serialized
    const serializedApplication = {
      ...application,
      _id: application._id?.toString(),
      createdAt: application.createdAt?.toISOString(),
      updatedAt: application.updatedAt?.toISOString(),
    }

    return NextResponse.json({ application: serializedApplication }, { status: 200 })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

// Update an application
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    const applicationId = params.id
    const updateData = await req.json()

    // Remove _id from update data if present
    if (updateData._id) {
      delete updateData._id
    }

    const updatedApplication = await Project.findByIdAndUpdate(applicationId, updateData, {
      new: true,
      runValidators: true,
    }).lean() as Record<string, any> | null

    if (!updatedApplication) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Convert MongoDB document to plain object and ensure _id is properly serialized
    const serializedApplication = {
      ...updatedApplication,
      _id: updatedApplication._id?.toString(),
      createdAt: updatedApplication.createdAt?.toISOString(),
      updatedAt: updatedApplication.updatedAt?.toISOString(),
    }

    return NextResponse.json({ application: serializedApplication }, { status: 200 })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

// Delete an application
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    const applicationId = params.id
    const deletedApplication = await Project.findByIdAndDelete(applicationId)

    if (!deletedApplication) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Application deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
