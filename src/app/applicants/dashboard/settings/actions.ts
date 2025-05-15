/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import Session from "@/models/Session"
import ActivityLog from "@/models/ActivityLog"
import { getSession } from "@/lib/utils/sessionutil"
import { forbidden } from "next/navigation"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import { generateVerificationToken } from "@/lib/utils/tokenUtil"
import { sendEmailVerification } from "@/lib/email/nodemailer"

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
  bio,
  organization,
  position,
  avatarUrl,
}: {
  userId: string
  names: string
  username: string
  email: string
  phone: string
  bio?: string
  organization?: string
  position?: string
  avatarUrl?: string
}) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    // Get the current user to check if email has changed
    const currentUser = await User.findById(userId)
    if (!currentUser) {
      throw new Error("User not found")
    }

    const emailChanged = currentUser.email !== email

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

    // Prepare update data
    const updateData: any = {
      names,
      username,
      email,
      phone,
      bio,
      organization,
      position,
    }

    // If avatar URL is provided, update it
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl
    }

    // If email has changed, set verification status and token
    if (emailChanged) {
      const verificationToken = generateVerificationToken()
      updateData.isEmailVerified = false
      updateData.verificationToken = verificationToken
      updateData.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    )

    // Log the activity
    await ActivityLog.create({
      userId,
      action: "profile_update",
      ipAddress: "127.0.0.1", // In a real app, get this from the request
      userAgent: "Unknown", // In a real app, get this from the request
      timestamp: new Date(),
      details: "Profile information updated",
    })

    // If email changed, send verification email
    if (emailChanged) {
      await sendEmailVerification(email, names, updateData.verificationToken)
    }

    revalidatePath("/applicants/dashboard/settings")
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

    // Log the activity
    await ActivityLog.create({
      userId: user._id,
      action: "password_change",
      ipAddress: "127.0.0.1", // In a real app, get this from the request
      userAgent: "Unknown", // In a real app, get this from the request
      timestamp: new Date(),
      details: "Password changed successfully",
    })

    revalidatePath("/applicants/dashboard/settings")
    return { success: true }
  } catch (error: any) {
    console.error("Error changing password:", error)
    throw new Error(error.message || "Failed to change password")
  }
}

// Toggle two-factor authentication
export async function toggleTwoFactorAuth({
  userId,
  enabled,
}: {
  userId: string
  enabled: boolean
}) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    const user = await User.findById(userId)

    if (!user) {
      throw new Error("User not found")
    }

    // Update two-factor authentication status
    await User.findByIdAndUpdate(userId, { twoFactorEnabled: enabled })

    // Log the activity
    await ActivityLog.create({
      userId,
      action: enabled ? "2fa_enabled" : "2fa_disabled",
      ipAddress: "127.0.0.1", // In a real app, get this from the request
      userAgent: "Unknown", // In a real app, get this from the request
      timestamp: new Date(),
      details: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
    })

    revalidatePath("/applicants/dashboard/settings")
    return { success: true }
  } catch (error: any) {
    console.error("Error toggling 2FA:", error)
    throw new Error(error.message || "Failed to update two-factor authentication")
  }
}

// Get active sessions
export async function getActiveSessions(userId: string) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    const sessions = await Session.find({ userId }).sort({ lastActive: -1 })
    return JSON.parse(JSON.stringify(sessions))
  } catch (error: any) {
    console.error("Error fetching sessions:", error)
    throw new Error("Failed to fetch active sessions")
  }
}

// Revoke a session
export async function revokeSession(sessionId: string) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    const sessionToRevoke = await Session.findById(sessionId)
    
    if (!sessionToRevoke) {
      throw new Error("Session not found")
    }

    // Ensure the user can only revoke their own sessions
    if (sessionToRevoke.userId.toString() !== (session.userId as string | { toString(): string }).toString()) {
      throw new Error("Unauthorized")
    }

    await Session.findByIdAndDelete(sessionId)

    // Log the activity
    await ActivityLog.create({
      userId: sessionToRevoke.userId,
      action: "session_revoked",
      ipAddress: "127.0.0.1", // In a real app, get this from the request
      userAgent: "Unknown", // In a real app, get this from the request
      timestamp: new Date(),
      details: "Session revoked",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error revoking session:", error)
    throw new Error(error.message || "Failed to revoke session")
  }
}

// Get user activity log
export async function getUserActivityLog(userId: string, page = 1, limit = 10) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  await dbConnect()

  try {
    const skip = (page - 1) * limit
    const activities = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit + 1) // Get one extra to check if there are more

    const hasMore = activities.length > limit
    const result = hasMore ? activities.slice(0, limit) : activities

    return {
      activities: JSON.parse(JSON.stringify(result)),
      hasMore,
    }
  } catch (error: any) {
    console.error("Error fetching activity log:", error)
    throw new Error("Failed to fetch activity log")
  }
}
