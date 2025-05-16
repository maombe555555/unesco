/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { forbidden } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"
import Project from "@/models/Project"
import { transporter } from "@/lib/email/nodemailer"

// Function to verify if the current user is an admin
async function verifyAdminAccess(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  if (session.role !== "admin") {
    forbidden()
  }
}

// Send custom email to applicant
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await verifyAdminAccess(req)
  await dbConnect()

  try {
    const applicationId = params.id
    const { subject, body } = await req.json()

    if (!subject || !body) {
      return NextResponse.json({ message: "Subject and body are required" }, { status: 400 })
    }

    const application = await Project.findById(applicationId)

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Determine the recipient email
    const recipientEmail = application.contactEmail || application.email

    if (!recipientEmail) {
      return NextResponse.json({ message: "No recipient email found for this application" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Send the email
    await transporter.sendMail({
      from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
      to: recipientEmail,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #0077cc; padding: 24px; text-align: center;">
              <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">UNESCO Participation Programme</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin-top: 0; font-size: 16px; line-height: 1.5;">Dear ${application.contactFirstName} ${application.contactFamilyName},</p>
              
              <div style="white-space: pre-line; font-size: 16px; line-height: 1.5;">${body}</div>
              
              <p style="font-size: 16px; line-height: 1.5; margin-top: 24px;">You can view your application details by logging into your dashboard.</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${baseUrl}/applicants/dashboard/application/${applicationId}" style="display: inline-block; background-color: #0077cc; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">View Your Application</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f5f7fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #666666; font-size: 14px;">© ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // Log the email communication
    application.communications = application.communications || []
    application.communications.push({
      type: "email",
      subject: subject,
      content: body,
      date: new Date(),
    })
    await application.save()

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
