/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import OTPVerification from "@/models/OTPVerification"
import { createSession, verifyTempToken } from "@/lib/utils/sessionutil"
import { z } from "zod"

const verifyOTPSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  tempToken: z.string().min(1, "Temporary token is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { otp, tempToken } = verifyOTPSchema.parse(body)

    await dbConnect()

    // Verify the temporary token
    const sessionData = await verifyTempToken(tempToken)
    if (!sessionData || !sessionData.requiresTwoFactor) {
      return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 })
    }

    const userId: string = String(sessionData.userId)
    const email: string = String(sessionData.email)
    const names: string = String(sessionData.names)
    const role: string = String(sessionData.role)
    const rememberMe = sessionData.rememberMe || false

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Verify OTP
    const otpRecord = await OTPVerification.findOne({
      userId,
      otp,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 })
    }

    // Delete the OTP record
    await OTPVerification.deleteOne({ _id: otpRecord._id })

    // Create a full session
    const expirationTime = rememberMe ? "30d" : "2h"
    const session = await createSession(userId, email, names, role, expirationTime)

    // Log the successful 2FA verification
    await logUserActivity(userId, "2fa_verification", request)

    return NextResponse.json({ message: "2FA verification successful", session }, { status: 200 })
  } catch (error) {
    console.error("Error during OTP verification:", error)

    if (error && typeof error === "object" && "name" in error && (error as any).name === "ZodError") {
      return NextResponse.json({ message: "Invalid form data", errors: (error as any).errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

async function logUserActivity(userId: string, action: string, request: Request) {
  try {
    const ActivityLog = (await import("@/models/ActivityLog")).default

    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    const userAgent = request.headers.get("user-agent") || "Unknown"

    await ActivityLog.create({
      userId,
      action,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      details: `Two-factor authentication completed successfully`,
    })
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}
