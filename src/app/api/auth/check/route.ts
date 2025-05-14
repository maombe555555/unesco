import { NextResponse } from "next/server"
import { getSession } from "@/lib/utils/sessionutil"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized: No session found" }, { status: 401 })
    }

    // Return user info without sensitive data
    return NextResponse.json({
      authenticated: true,
      role: session.role,
      userId: session.userId,
      email: session.email,
      names: session.names,
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Unauthorized: Session verification failed" }, { status: 401 })
  }
}
