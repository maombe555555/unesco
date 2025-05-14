import { getSession } from "@/lib/utils/sessionutil"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("Session data:", session)

    // Handle the userId which is a buffer object
    let userIdString = ""

    if (session.userId && session.userId instanceof Buffer) {
      // Convert buffer to hex string (standard MongoDB ObjectId string format)
      const buffer = session.userId
      userIdString = Array.from(buffer)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    } else if (typeof session.userId === "string") {
      userIdString = session.userId
    } else {
      // Fallback
      userIdString = String(session.userId)
    }

    console.log("Converted userId:", userIdString)

    // Only return necessary user data
    return NextResponse.json({
      userId: userIdString,
      email: session.email,
      names: session.names,
      role: session.role,
    })
  } catch (error) {
    console.error("Session fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
