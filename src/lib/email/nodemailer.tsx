/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"

// Create a transporter
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})


export async function sendVerificationEmail(to: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Verify Your Email Address</h1>
        <p>Hello ${name},</p>
        <p>Thank you for registering with the UNESCO Participation Programme. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendOTPEmail(to: string, name: string, otp: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Your Login Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Your Verification Code</h1>
        <p>Hello ${name},</p>
        <p>You are receiving this email because you enabled two-factor authentication for your UNESCO Participation Programme account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; font-size: 32px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
        </div>
        <p>This verification code will expire in 10 minutes.</p>
        <p>If you did not attempt to log in, please change your password immediately and contact our support team.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendEmailVerification(to: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Verify Your New Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Verify Your New Email Address</h1>
        <p>Hello ${name},</p>
        <p>You recently changed your email address for your UNESCO Participation Programme account. Please verify this new email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not change your email address, please contact our support team immediately.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendWelcomeEmail(to: string, name: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Welcome to UNESCO Participation Programme",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Welcome to UNESCO Participation Programme</h1>
        <p>Hello ${name},</p>
        <p>Thank you for verifying your email address. Your account is now active and you can start using our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/login" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign In</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const resetUrl = `${baseUrl}/reset-password?token=${token}`

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Reset Your Password</h1>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password for your UNESCO Participation Programme account. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendPasswordChangedEmail(to: string, name: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Your Password Has Been Changed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Password Changed Successfully</h1>
        <p>Hello ${name},</p>
        <p>Your password for the UNESCO Participation Programme has been successfully changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/login" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign In</a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}



export async function sendContactConfirmationEmail(to: string, name: string, subject: string) {
  const mailOptions = {
    from: `"UNESCO CNRU" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "We've Received Your Message - UNESCO CNRU",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="UNESCO CNRU Logo" style="width: 150px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Thank You for Contacting Us</h1>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out to UNESCO CNRU. We have received your message regarding:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-style: italic;">"${subject}"</p>
        <p>Our team will review your inquiry and get back to you as soon as possible. Please allow 1-2 business days for a response.</p>
        <p>If your matter is urgent, please contact us directly at <a href="mailto:info@unesco-cnru.org">info@unesco-cnru.org</a>.</p>
        <p>Best regards,<br>UNESCO CNRU Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} UNESCO CNRU. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendAdminNotificationEmail(messageData: {
  name: string
  email: string
  subject: string
  message: string
  id: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const mailOptions = {
    from: `"UNESCO CNRU Contact Form" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to: adminEmail,
    subject: `New Contact Form Submission: ${messageData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${appUrl}/logo.png" alt="UNESCO CNRU Logo" style="width: 150px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">New Contact Form Submission</h1>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p><strong>From:</strong> ${messageData.name} (${messageData.email})</p>
          <p><strong>Subject:</strong> ${messageData.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line;">${messageData.message}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${appUrl}/admin/dashboard/message" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View in Admin Panel</a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO CNRU. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}


export async function sendApplicationStatusUpdateEmail(to: string, name: string, status: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Your Application Status Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Application Status Update</h1>
        <p>Hello ${name},</p>
        <p>We wanted to inform you that the status of your application has been updated to:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-weight: bold;">${status}</p>
        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/login" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Application</a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}








// Send application approval email

export async function sendApplicationApprovalEmail(to: string, name: string, applicationId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: "Application Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 100px; height: auto;">
        </div>
        <h1 style="color: #0077D4; text-align: center;">Application Approved</h1>
        <p>Hello ${name},</p>
        <p>Congratulations! Your application with ID ${applicationId} has been approved.</p>
        <p>You can now proceed with the next steps in the process.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/login" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Application</a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}











export async function sendApplicationSubmissionEmail(
  email: string,
  name: string,
  applicationId: string,
  projectTitle: string,
  projectName: string,
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const viewApplicationUrl = `${baseUrl}/applicants/dashboard/application/${applicationId}`

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: "Application Submission Confirmation - UNESCO Participation Programme",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Submission Confirmation</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background-color: #0077cc; padding: 24px; text-align: center;">
            <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Application Submitted Successfully</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <p style="margin-top: 0; font-size: 16px; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.5;">Thank you for submitting your application to the UNESCO Participation Programme. We have received your submission and it is now being processed.</p>
            
            <div style="background-color: #f5f7fa; border-left: 4px solid #0077cc; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <h2 style="margin-top: 0; margin-bottom: 16px; color: #0077cc; font-size: 18px;">Application Details</h2>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; width: 40%;">Application ID:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${applicationId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Project Title:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${projectTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Project Name:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${projectName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Submission Date:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: #fff7e6; color: #b78105; font-weight: 600; padding: 4px 8px; border-radius: 4px; font-size: 14px;">Pending Review</span>
                  </td>
                </tr>
              </table>
            </div>
            
            <h2 style="color: #0077cc; font-size: 18px; margin-top: 32px; margin-bottom: 16px;">What Happens Next?</h2>
            
            <ol style="padding-left: 24px; font-size: 16px; line-height: 1.5;">
              <li style="margin-bottom: 12px;">Our team will review your application thoroughly.</li>
              <li style="margin-bottom: 12px;">You may be contacted if additional information is required.</li>
              <li style="margin-bottom: 12px;">You will receive an email notification when there's an update to your application status.</li>
              <li>The review process typically takes 2-4 weeks.</li>
            </ol>
            
            <p style="font-size: 16px; line-height: 1.5; margin-top: 24px;">You can track the status of your application at any time by logging into your dashboard.</p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${viewApplicationUrl}" style="display: inline-block; background-color: #0077cc; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">View Your Application</a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@unesco.org" style="color: #0077cc; text-decoration: none;">support@unesco.org</a>.</p>
            
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 0;">Thank you for your interest in the UNESCO Participation Programme.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f5f7fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #666666; font-size: 14px;">© ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
            <div style="margin-top: 16px;">
              <a href="${baseUrl}/privacy-policy" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Privacy Policy</a>
              <a href="${baseUrl}/terms-of-service" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Terms of Service</a>
              <a href="${baseUrl}/contact-us" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Contact Us</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendApplicationSubmissionEmailToAdmin(props: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER
  const adminViewUrl = `${baseUrl}/admin/dashboard/application/${props._id}`

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to: adminEmail,
    subject: `New Application: ${props.projectTitle || "Untitled Project"} (ID: ${props._id})`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Application Submission</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333333;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background-color: #0077cc; padding: 24px; text-align: center;">
            <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Application Submission</h1>
          </div>
          
          <!-- Summary Section -->
          <div style="padding: 24px; background-color: #f5f7fa; border-bottom: 1px solid #e5e7eb;">
            <h2 style="margin-top: 0; color: #0077cc; font-size: 18px; margin-bottom: 16px;">Application Summary</h2>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; color: #666666; width: 30%;">Application ID:</td>
                <td style="padding: 8px 0; font-weight: 600;">${props._id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;">Project Title:</td>
                <td style="padding: 8px 0; font-weight: 600;">${props.projectTitle || "Not specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;">Applicant:</td>
                <td style="padding: 8px 0; font-weight: 600;">${props.contactFirstName || ""} ${props.contactFamilyName || ""} (${props.email || "No email"})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;">Organization:</td>
                <td style="padding: 8px 0; font-weight: 600;">${props.orgName || "Not specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666;">Submission Date:</td>
                <td style="padding: 8px 0; font-weight: 600;">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
              </tr>
            </table>
            
            <div style="text-align: center; margin-top: 24px;">
              <a href="${adminViewUrl}" style="display: inline-block; background-color: #0077cc; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px; margin-right: 12px;">View Full Application</a>
              <a href="${baseUrl}/admin/dashboard/applications" style="display: inline-block; background-color: #ffffff; color: #0077cc; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px; border: 1px solid #0077cc;">View All Applications</a>
            </div>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <h2 style="margin-top: 0; color: #0077cc; font-size: 20px; margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">Application Details</h2>
            
            <!-- Project Information -->
            <div style="margin-bottom: 32px;">
              <h3 style="color: #0077cc; font-size: 18px; margin-bottom: 16px;">Project Information</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; width: 30%; vertical-align: top;">Project Name:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.projectName || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Project Title:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.projectTitle || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Duration:</td>
                  <td style="padding: 8px 0; vertical-align: top;">From ${formatDate(props.startDate)} to ${formatDate(props.endDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Implementation Location:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.placeOfImplementation || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Project Description:</td>
                  <td style="padding: 8px 0; vertical-align: top; white-space: pre-line;">${props.projectDescription || "Not provided"}</td>
                </tr>
              </table>
            </div>
            
            <!-- Organization Information -->
            <div style="margin-bottom: 32px;">
              <h3 style="color: #0077cc; font-size: 18px; margin-bottom: 16px;">Organization Information</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; width: 30%; vertical-align: top;">Organization Name:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.orgName || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Organization Type:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.orgType || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Representative:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.repName || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Contact Person:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.contactFirstName || ""} ${props.contactFamilyName || ""} (${props.contactEmail || "No email"})</td>
                </tr>
                ${
                  props.contactPersonIfNotLegal
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #666666; vertical-align: top;">Alternative Contact:</td>
                  <td style="padding: 8px 0; vertical-align: top;">${props.contactPersonIfNotLegal}</td>
                </tr>
                `
                    : ""
                }
              </table>
            </div>
            
            <!-- Project Details -->
            <div style="margin-bottom: 32px;">
              <h3 style="color: #0077cc; font-size: 18px; margin-bottom: 16px;">Project Objectives & Implementation</h3>
              
              <div style="margin-bottom: 16px;">
                <h4 style="margin-top: 0; margin-bottom: 8px; color: #333333; font-size: 16px;">Main Objective</h4>
                <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-line;">${props.projectMainObjective || "Not provided"}</div>
              </div>
              
              <div style="margin-bottom: 16px;">
                <h4 style="margin-top: 0; margin-bottom: 8px; color: #333333; font-size: 16px;">Specific Objectives</h4>
                <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-line;">${props.specificObjectives || "Not provided"}</div>
              </div>
              
              <div style="margin-bottom: 16px;">
                <h4 style="margin-top: 0; margin-bottom: 8px; color: #333333; font-size: 16px;">Implementation Plan</h4>
                <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-line;">${props.implementationPlan || "Not provided"}</div>
              </div>
              
              <div style="margin-bottom: 16px;">
                <h4 style="margin-top: 0; margin-bottom: 8px; color: #333333; font-size: 16px;">Target Groups</h4>
                <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-line;">${props.targetGroups || "Not provided"}</div>
              </div>
              
              <div>
                <h4 style="margin-top: 0; margin-bottom: 8px; color: #333333; font-size: 16px;">Communication Plan</h4>
                <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-line;">${props.communicationPlan || "Not provided"}</div>
              </div>
            </div>
            
            <!-- Location Information -->
            <div style="margin-bottom: 32px;">
              <h3 style="color: #0077cc; font-size: 18px; margin-bottom: 16px;">Location Information</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; width: 30%;">Province:</td>
                  <td style="padding: 8px 0;">${props.selectedProvince || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">District:</td>
                  <td style="padding: 8px 0;">${props.selectedDistrict || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Sector:</td>
                  <td style="padding: 8px 0;">${props.selectedSector || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Cell:</td>
                  <td style="padding: 8px 0;">${props.selectedCell || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Village:</td>
                  <td style="padding: 8px 0;">${props.selectedVillage || "Not specified"}</td>
                </tr>
              </table>
            </div>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <a href="${adminViewUrl}" style="display: inline-block; background-color: #0077cc; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px; margin: 0 8px 12px 8px;">View Full Application</a>
              <a href="${baseUrl}/admin/dashboard/application/${props._id}/approve" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px; margin: 0 8px 12px 8px;">Approve Application</a>
              <a href="${baseUrl}/admin/dashboard/application/${props._id}/reject" style="display: inline-block; background-color: #ef4444; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px; margin: 0 8px 12px 8px;">Reject Application</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f5f7fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #666666; font-size: 14px;">© ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
            <p style="margin-top: 8px; color: #666666; font-size: 14px;">This email was sent to you because you are an administrator of the UNESCO Participation Programme.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}








export async function sendStatusUpdateEmail(
  email: string,
  name: string,
  applicationId: string,
  projectTitle: string,
  status: string,
  feedback?: string,
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const viewApplicationUrl = `${baseUrl}/applicants/dashboard/application/${applicationId}`

  // Determine status-specific content
  let statusTitle = ""
  let statusColor = ""
  let statusMessage = ""
  let nextSteps = ""

  switch (status.toLowerCase()) {
    case "approved":
      statusTitle = "Application Approved"
      statusColor = "#10b981" // green
      statusMessage = "Congratulations! Your application has been approved."
      nextSteps = `
        <ol style="padding-left: 24px; font-size: 16px; line-height: 1.5;">
          <li style="margin-bottom: 12px;">Our team will contact you shortly with further instructions.</li>
          <li style="margin-bottom: 12px;">Please review any attached documentation or requirements.</li>
          <li style="margin-bottom: 12px;">Prepare for the implementation phase of your project.</li>
          <li>Keep your contact information updated for seamless communication.</li>
        </ol>
      `
      break
    case "rejected":
      statusTitle = "Application Status Update"
      statusColor = "#ef4444" // red
      statusMessage =
        "After careful review, we regret to inform you that your application has not been selected for the current funding cycle."
      nextSteps = `
        <p style="font-size: 16px; line-height: 1.5;">We encourage you to:</p>
        <ul style="padding-left: 24px; font-size: 16px; line-height: 1.5;">
          <li style="margin-bottom: 12px;">Review the feedback provided below.</li>
          <li style="margin-bottom: 12px;">Consider applying again in the future with an improved proposal.</li>
          <li>Contact us if you have any questions or need clarification.</li>
        </ul>
      `
      break
    default:
      statusTitle = "Application Status Update"
      statusColor = "#f59e0b" // amber
      statusMessage = "There has been an update to your application status."
      nextSteps = `
        <p style="font-size: 16px; line-height: 1.5;">Please log in to your dashboard to view the latest information about your application.</p>
      `
  }

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: `${statusTitle} - UNESCO Participation Programme`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${statusTitle}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background-color: ${statusColor}; padding: 24px; text-align: center;">
            <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">${statusTitle}</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <p style="margin-top: 0; font-size: 16px; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.5;">${statusMessage}</p>
            
            <div style="background-color: #f5f7fa; border-left: 4px solid ${statusColor}; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <h2 style="margin-top: 0; margin-bottom: 16px; color: #0077cc; font-size: 18px;">Application Details</h2>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; width: 40%;">Application ID:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${applicationId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Project Title:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${projectTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: ${
                      status.toLowerCase() === "approved"
                        ? "#ecfdf5"
                        : status.toLowerCase() === "rejected"
                          ? "#fef2f2"
                          : "#fff7ed"
                    }; color: ${
                      status.toLowerCase() === "approved"
                        ? "#047857"
                        : status.toLowerCase() === "rejected"
                          ? "#b91c1c"
                          : "#9a3412"
                    }; font-weight: 600; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${
                      status.charAt(0).toUpperCase() + status.slice(1)
                    }</span>
                  </td>
                </tr>
              </table>
            </div>
            
            ${
              feedback
                ? `
            <h2 style="color: #0077cc; font-size: 18px; margin-top: 32px; margin-bottom: 16px;">Feedback from the Review Committee</h2>
            <div style="background-color: #f9f9f9; padding: 16px; border-radius: 4px; white-space: pre-line; font-size: 16px; line-height: 1.5;">${feedback}</div>
            `
                : ""
            }
            
            <h2 style="color: #0077cc; font-size: 18px; margin-top: 32px; margin-bottom: 16px;">Next Steps</h2>
            ${nextSteps}
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${viewApplicationUrl}" style="display: inline-block; background-color: #0077cc; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">View Your Application</a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@unesco.org" style="color: #0077cc; text-decoration: none;">support@unesco.org</a>.</p>
            
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 0;">Thank you for your interest in the UNESCO Participation Programme.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f5f7fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #666666; font-size: 14px;">© ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
            <div style="margin-top: 16px;">
              <a href="${baseUrl}/privacy-policy" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Privacy Policy</a>
              <a href="${baseUrl}/terms-of-service" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Terms of Service</a>
              <a href="${baseUrl}/contact-us" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Contact Us</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}







export async function sendEvaluationNotificationEmail(
  email: string,
  name: string,
  applicationId: string,
  projectTitle: string,
  marks: number,
  feedback?: string,
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const viewApplicationUrl = `${baseUrl}/applicants/dashboard/application/${applicationId}`

  // Determine score-specific content
  let scoreCategory = ""
  let scoreColor = ""
  let scoreMessage = ""

  if (marks >= 80) {
    scoreCategory = "Excellent"
    scoreColor = "#10b981" // green
    scoreMessage = "Congratulations on achieving an excellent score in your evaluation!"
  } else if (marks >= 70) {
    scoreCategory = "Very Good"
    scoreColor = "#059669" // green-600
    scoreMessage = "Your project has received a very good evaluation score."
  } else if (marks >= 60) {
    scoreCategory = "Good"
    scoreColor = "#0ea5e9" // sky-500
    scoreMessage = "Your project has received a good evaluation score."
  } else if (marks >= 50) {
    scoreCategory = "Satisfactory"
    scoreColor = "#f59e0b" // amber-500
    scoreMessage = "Your project has received a satisfactory evaluation score."
  } else {
    scoreCategory = "Needs Improvement"
    scoreColor = "#ef4444" // red-500
    scoreMessage = "Your project evaluation indicates areas that need improvement."
  }

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: `Project Evaluation Results - UNESCO Participation Programme`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Evaluation Results</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background-color: ${scoreColor}; padding: 24px; text-align: center;">
            <img src="${baseUrl}/unesco-logo.jpg" alt="UNESCO Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Project Evaluation Results</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <p style="margin-top: 0; font-size: 16px; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.5;">${scoreMessage}</p>
            
            <div style="background-color: #f5f7fa; border-left: 4px solid ${scoreColor}; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <h2 style="margin-top: 0; margin-bottom: 16px; color: #0077cc; font-size: 18px;">Evaluation Summary</h2>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr>
                  <td style="padding: 8px 0; color: #666666; width: 40%;">Project Title:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${projectTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Application ID:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${applicationId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666666;">Evaluation Score:</td>
                  <td style="padding: 8px 0;">
                    <span style="background-color: ${scoreColor}; color: white; font-weight: 600; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${marks}/100</span>
                    <span style="margin-left: 8px; font-weight: 600;">${scoreCategory}</span>
                  </td>
                </tr>
              </table>
            </div>
            
            ${
              feedback
                ? `
            <h2 style="color: #0077cc; font-size: 18px; margin-top: 32px; margin-bottom: 16px;">Evaluation Feedback</h2>
            <div style="background-color: #f9f9f9; padding: 16px; border-radius: 4px; white-space: pre-line; font-size: 16px; line-height: 1.5;">${feedback}</div>
            `
                : ""
            }
            
            <h2 style="color: #0077cc; font-size: 18px; margin-top: 32px; margin-bottom: 16px;">Next Steps</h2>
            <p style="font-size: 16px; line-height: 1.5;">Based on your evaluation results:</p>
            <ul style="padding-left: 24px; font-size: 16px; line-height: 1.5;">
              <li style="margin-bottom: 12px;">Review the detailed feedback provided by our evaluation committee.</li>
              <li style="margin-bottom: 12px;">Check your application status for any updates regarding approval or rejection.</li>
              <li style="margin-bottom: 12px;">You may be contacted for additional information or clarification if needed.</li>
              <li>Keep your contact information updated for seamless communication.</li>
            </ul>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${viewApplicationUrl}" style="display: inline-block; background-color: #0077cc; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">View Your Application</a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">If you have any questions about your evaluation or need further clarification, please don't hesitate to contact our support team at <a href="mailto:support@unesco.org" style="color: #0077cc; text-decoration: none;">support@unesco.org</a>.</p>
            
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 0;">Thank you for your participation in the UNESCO Participation Programme.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f5f7fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #666666; font-size: 14px;">© ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
            <div style="margin-top: 16px;">
              <a href="${baseUrl}/privacy-policy" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Privacy Policy</a>
              <a href="${baseUrl}/terms-of-service" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Terms of Service</a>
              <a href="${baseUrl}/contact-us" style="color: #0077cc; text-decoration: none; font-size: 14px; margin: 0 8px;">Contact Us</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}
