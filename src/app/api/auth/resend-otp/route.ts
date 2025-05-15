import { NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"
import { verifyTempToken } from "@/lib/utils/sessionutil"
import { generateOTP, storeOTP } from "@/lib/utils/otpUtil"
import { sendOTPEmail } from "@/lib/email/nodemailer"
import { z } from "zod"

const resendOTPSchema = z.object({
  tempToken: z.string().min(1, "Temporary token is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tempToken } = resendOTPSchema.parse(body)

    await dbConnect()

    // Verify the temporary token
    const sessionData = await verifyTempToken(tempToken)
    if (!sessionData || !sessionData.requiresTwoFactor) {
      return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 })
    }

    const userId = sessionData.userId
    const email = sessionData.email
    const names = sessionData.names

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Generate new OTP
    const otp = generateOTP()

    // Store OTP in database
    await storeOTP(userId, otp)

    // Send OTP via email
    await sendOTPEmail(email, names, otp)

    return NextResponse.json({ message: "OTP resent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error resending OTP:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid form data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
