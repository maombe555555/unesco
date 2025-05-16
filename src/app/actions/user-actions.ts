/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { forbidden } from "next/navigation"

// Import the session utility at the top of the file
import { getSession } from "@/lib/utils/sessionutil"

// Function to verify if the current user is an admin
async function verifyAdminAccess() {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  // Check if the user has admin role
  if (session.role !== "admin") {
    forbidden()
  }
}

// Get all users
export async function getAllUsers() {
  await verifyAdminAccess()
  await dbConnect()

  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean()

    // Convert MongoDB documents to plain objects and ensure _id is properly serialized
    return users.map((user) => ({
      ...user,
      _id: (user as { _id: any })._id.toString(),
      createdAt: (user as unknown as { createdAt: Date }).createdAt.toISOString(),
      updatedAt: (user as unknown as { updatedAt: Date }).updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

// Update user
export async function updateUser({
  userId,
  userData,
}: {
  userId: string
  userData: {
    names: string
    username: string
    email: string
    phone: string
    role: string
    isEmailVerified: boolean
  }
}) {
  await verifyAdminAccess()
  await dbConnect()

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        names: userData.names,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified,
      },
      { new: true, lean: true },
    ) as unknown as {
      _id: any
      names: string
      username: string
      email: string
      phone: string
      role: string
      isEmailVerified: boolean
      createdAt: Date
      updatedAt: Date
    } | null

    if (!user) {
      throw new Error("User not found")
    }

    revalidatePath("/admin/dashboard/users")

    // Convert MongoDB document to plain object and ensure _id is properly serialized
    if (user && !Array.isArray(user)) {
      return {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }
    } else {
      throw new Error("Unexpected result: user is not a single document")
    }
  } catch (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }
}

// Delete user
export async function deleteUser(userId: string) {
  await verifyAdminAccess()
  await dbConnect()

  try {
    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      throw new Error("User not found")
    }

    revalidatePath("/admin/dashboard/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }
}
