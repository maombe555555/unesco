import nodemailer from "nodemailer"

// Configure email transporter
// For production, use your actual SMTP settings
// For development, you can use services like Mailtrap, SendGrid, or even Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production",
})

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="UNESCO Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #0077D4; text-align: center;">Verify Your Email Address</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with the UNESCO Participation Programme. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
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

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  const mailOptions = {
    from: `"UNESCO Participation Programme" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="UNESCO Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #0077D4; text-align: center;">Reset Your Password</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password for the UNESCO Participation Programme. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0077D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendSupportEmail(email: string, name: string, subject: string, message: string) {
  const mailOptions = {
    from: `"UNESCO Support" <${process.env.EMAIL_FROM}>`,
    to: process.env.SUPPORT_EMAIL,
    subject: `Support Request: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #0077D4;">New Support Request</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin-top: 20px;">
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}
