"use server"

import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { getSession } from "@/lib/utils/sessionutil"
import { forbidden } from "next/navigation"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

// Get user profile
export async function getUserProfile() {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    // Convert userId to string if it's an object
    let userIdStr = session.userId

    // If userId is an object with a buffer property, convert it to a string
    if (typeof session.userId === "object" && session.userId !== null) {
      // Check if it has a toString method (like ObjectId)
      if (typeof session.userId.toString === "function") {
        userIdStr = session.userId.toString()
      }
      // If it has a buffer property (like in your error), try to convert it
      else if ((session.userId as any).buffer) {
        userIdStr = new mongoose.Types.ObjectId(Buffer.from(Object.values((session.userId as { buffer: ArrayBuffer }).buffer))).toString()
      }
    }


    // Find user by email as a fallback if userId is problematic
    let user
    if (session.email) {
      user = await User.findOne({ email: session.email })
    }

    // If no user found by email, try with the ID
    if (!user && userIdStr) {
      try {
        user = await User.findById(userIdStr)
      } catch (idError) {
        console.error("Error finding user by ID:", idError)
      }
    }

    if (!user) {
      throw new Error("User not found")
    }

    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw new Error("Failed to fetch user profile")
  }
}

// Update profile information
export async function updateProfile({
  userId,
  names,
  username,
  email,
  phone,
}: {
  userId: string
  names: string
  username: string
  email: string
  phone: string
}) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    // Check if email or username is already taken by another user
    const existingUser = await User.findOne({
      $or: [
        { email, _id: { $ne: userId } },
        { username, _id: { $ne: userId } },
      ],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("Email is already in use")
      }
      if (existingUser.username === username) {
        throw new Error("Username is already taken")
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        names,
        username,
        email,
        phone,
      },
      { new: true },
    )

    if (!updatedUser) {
      throw new Error("User not found")
    }

    revalidatePath("/applicants/dashboard/profile")
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error: any) {
    console.error("Error updating profile:", error)
    throw new Error(error.message || "Failed to update profile")
  }
}

// Change password
export async function changePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string
  currentPassword: string
  newPassword: string
}) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    // Find user by email as a fallback if userId is problematic
    let user
    if (session.email) {
      user = await User.findOne({ email: session.email })
    } else {
      user = await User.findById(userId)
    }

    if (!user) {
      throw new Error("User not found")
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword })

    revalidatePath("/applicants/dashboard/profile")
    return { success: true }
  } catch (error: any) {
    console.error("Error changing password:", error)
    throw new Error(error.message || "Failed to change password")
  }
}

// Request email verification
export async function requestEmailVerification(userId: string) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    // Find user by email as a fallback if userId is problematic
    let user
    if (session.email) {
      user = await User.findOne({ email: session.email })
    } else {
      user = await User.findById(userId)
    }

    if (!user) {
      throw new Error("User not found")
    }

    // In a real implementation, you would:
    // 1. Generate a verification token
    // 2. Save it to the database
    // 3. Send an email with a verification link

    // For now, we'll just simulate the process
    console.log(`Sending verification email to ${user.email}`)

    return { success: true }
  } catch (error: any) {
    console.error("Error requesting email verification:", error)
    throw new Error(error.message || "Failed to request email verification")
  }
}

// Get user activity log
export async function getUserActivity(userId: string) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  // In a real implementation, you would fetch activity logs from the database
  // For now, we'll return an empty array
  return []
}
