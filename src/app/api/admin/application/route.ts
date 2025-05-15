
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { type NextRequest, NextResponse } from "next/server"
import { forbidden } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"
import Project from "@/models/Project"


async function verifyAdminAccess(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  if (session.role !== "admin") {
    forbidden()
  }
}

export async function GET(req: NextRequest) {
    await verifyAdminAccess(req)
    await dbConnect()

    try {
        const applications = await Project.find({}).sort({ createdAt: -1 }).lean()

        // Convert MongoDB documents to plain objects and ensure _id is properly serialized
        const serializedApplications = applications.map((application: any) => ({
            ...application,
            _id: application._id.toString(),
            createdAt: application.createdAt.toISOString(),
            updatedAt: application.updatedAt.toISOString(),
        }))

        return NextResponse.json({ applications: serializedApplications }, { status: 200 })
    } catch (error) {
        console.error("Error fetching applications:", error)
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }

}

// edit application

export async function PATCH(req: NextRequest) {
    await verifyAdminAccess(req)
    await dbConnect()

    const { id, status } = await req.json()

    try {
        const updatedApplication = await Project.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean()

        if (!updatedApplication) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        const serializedApplication = {
            ...(updatedApplication as any),
            _id: (updatedApplication as any)._id.toString(),
            createdAt: (updatedApplication as any).createdAt.toISOString(),
            updatedAt: (updatedApplication as any).updatedAt.toISOString(),
        }

        return NextResponse.json({ application: serializedApplication }, { status: 200 })
    } catch (error) {
        console.error("Error updating application:", error)
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }
}