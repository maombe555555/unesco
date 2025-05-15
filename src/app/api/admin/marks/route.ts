/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Get all projects for marking
export async function GET(req: NextRequest) {
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    // Get projects with minimal fields needed for marking
    const projects = await Project.find(
      {},
      {
        projectName: 1,
        projectTitle: 1,
        orgName: 1,
        email: 1,
        contactFirstName: 1,
        contactFamilyName: 1,
        status: 1,
        marks: 1,
        feedback: 1,
        createdAt: 1,
      },
    )
      .sort({ createdAt: -1 })
      .lean()

    // Convert MongoDB documents to plain objects and ensure _id is properly serialized
    const serializedProjects = projects.map((project: any) => ({
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt ? project.updatedAt.toISOString() : undefined,
    }))

    return NextResponse.json({ projects: serializedProjects }, { status: 200 })
  } catch (error) {
    console.error("Error fetching projects for marking:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
