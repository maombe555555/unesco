import user from "@/models/User"
import dbConnect from "@/lib/Mongodb"
import { NextResponse } from "next/server"
import { comparePassword } from "@/lib/utils/passwordUtil"
import { createSession } from "@/lib/utils/sessionutil"
import { loginSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = loginSchema.parse(body)

    await dbConnect()
    const userData = await user.find({ email })

    if (userData.length === 0) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = await comparePassword(password, userData[0].password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const userId = userData[0]._id
    const names = userData[0].names
    const role = userData[0].role

    // Set session expiration based on rememberMe
    const expirationTime = rememberMe ? "30d" : "2h" // 30 days or 2 hours

    const session = await createSession(userId, email, names, role, expirationTime)

    return NextResponse.json({ message: "Login successful", session }, { status: 200 })
  } catch (error) {
    console.error("Error during login:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Invalid form data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
