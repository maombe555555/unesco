import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/Mongodb';
import User from '@/models/User'; // Assuming you have a User model
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service or SMTP server
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    await dbConnect(); // Connect to your database
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate a password reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();
    // Send email with the password reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      to: user.email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetUrl}">Reset Password</a></p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email address' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending password reset link' });
  }
}