import { NextResponse } from "next/server"
import { sendSupportEmail } from "@/lib/utils/email"
import { supportSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = supportSchema.parse(body)

    // Send support email
    await sendSupportEmail(email, name, subject, message)

    return NextResponse.json({
      message: "Your message has been sent. Our support team will contact you shortly.",
    })
  } catch (error) {
    console.error("Error sending support email:", error)
    return NextResponse.json({ message: "Failed to send support request" }, { status: 500 })
  }
}
