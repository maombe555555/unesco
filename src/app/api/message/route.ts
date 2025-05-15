/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/Mongodb"
import Message from "@/models/Message"
import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations/contact"
import { sendContactConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email/nodemailer"

export async function GET() {
  try {
    await dbConnect()
    const messages = await Message.find({}).sort({ createdAt: -1 })
    return NextResponse.json(messages, { status: 200 })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ message: "Validation error", errors: validationResult.error.errors }, { status: 400 })
    }

    const { name, email, subject, message } = validationResult.data

    // Get IP address and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    await dbConnect()

    // Create and save the message
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent,
    })

    await newMessage.save()

    // Send confirmation email to the sender
    try {
      await sendContactConfirmationEmail(email, name, subject)
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError)
      // Continue execution even if sending confirmation email fails
    }

    // Send notification email to admin
    try {
      await sendAdminNotificationEmail({
        name,
        email,
        subject,
        message,
        id: newMessage._id.toString(),
      })
    } catch (emailError) {
      console.error("Error sending admin notification email:", emailError)
      // Continue execution even if sending admin notification email fails
    }

    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: {
          id: newMessage._id,
          name,
          email,
          subject,
          createdAt: newMessage.createdAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error saving message:", error)
    return NextResponse.json({ message: "Failed to save message" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, isRead, adminNotes } = await request.json()

    if (!id) {
      return NextResponse.json({ message: "Message ID is required" }, { status: 400 })
    }

    await dbConnect()

    const updateData: any = {}

    if (status !== undefined) {
      updateData.status = status
    }

    if (isRead !== undefined) {
      updateData.isRead = isRead
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    const updatedMessage = await Message.findByIdAndUpdate(id, updateData, { new: true })

    if (!updatedMessage) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(updatedMessage, { status: 200 })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ message: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ message: "Message ID is required" }, { status: 400 })
    }

    await dbConnect()

    const deletedMessage = await Message.findByIdAndDelete(id)

    if (!deletedMessage) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Message deleted successfully", id }, { status: 200 })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ message: "Failed to delete message" }, { status: 500 })
  }
}
