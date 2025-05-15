import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/Mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ valid: false, message: "Token is required" }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ valid: false, message: "Invalid or expired token" }, { status: 200 })
    }

    return NextResponse.json({ valid: true, message: "Token is valid" }, { status: 200 })
  } catch (error) {
    console.error("Error verifying reset token:", error)
    return NextResponse.json({ valid: false, message: "An error occurred" }, { status: 500 })
  }
}
