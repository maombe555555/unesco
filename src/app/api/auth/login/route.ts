/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "@/models/User"
import dbConnect from "@/lib/Mongodb"
import { NextResponse } from "next/server"
import { comparePassword } from "@/lib/utils/passwordUtil"
import { createSession } from "@/lib/utils/sessionutil"
import { generateOTP, storeOTP } from "@/lib/utils/otpUtil"
import { sendOTPEmail } from "@/lib/email/nodemailer"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = loginSchema.parse(body)

    await dbConnect()
    const userData = await User.findOne({ email })

    if (!userData) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified
    if (!userData.isEmailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email before logging in",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 },
      )
    }

    const isPasswordValid = await comparePassword(password, userData.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const userId = userData._id
    const names = userData.names
    const role = userData.role

    // Check if 2FA is enabled
    if (userData.twoFactorEnabled) {
      // Generate OTP
      const otp = generateOTP()

      // Store OTP in database
      await storeOTP(userId, otp)

      // Send OTP via email
      await sendOTPEmail(email, names, otp)

      // Create a temporary session token for 2FA verification
      const tempToken = await createSession(
        userId,
        email,
        names,
        role,
        "10m", // Short expiration for 2FA verification
        true, // Mark as requiring 2FA
        rememberMe, // Pass rememberMe to be used after 2FA verification
      )

      return NextResponse.json(
        {
          message: "2FA verification required",
          requiresTwoFactor: true,
          tempToken: tempToken.token,
        },
        { status: 200 },
      )
    }

    // Set session expiration based on rememberMe
    const expirationTime = rememberMe ? "30d" : "2h" // 30 days or 2 hours

    const session = await createSession(userId, email, names, role, expirationTime)

    // Log the login activity
    await logUserActivity(userId, "login", request)

    return NextResponse.json({ message: "Login successful", session }, { status: 200 })
  } catch (error) {
    console.error("Error during login:", error)

    if (error && typeof error === "object" && "name" in error && (error as any).name === "ZodError") {
      return NextResponse.json({ message: "Invalid form data", errors: (error as any).errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

async function logUserActivity(userId: string, action: string, request: Request) {
  try {
    const ActivityLog = (await import("@/models/ActivityLog")).default

    // Get IP address and user agent from request
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    const userAgent = request.headers.get("user-agent") || "Unknown"

    await ActivityLog.create({
      userId,
      action,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      details: `User logged in successfully`,
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    // Don't throw error, just log it
  }
}
