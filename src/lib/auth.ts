import { z } from "zod"

export const registerSchema = z
  .object({
    names: z
      .string()
      .min(1, { message: "Name is required" })
      .max(50, { message: "Name must be less than 50 characters long" }),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .max(50, { message: "Email must be less than 50 characters long" })
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(50, { message: "Password must be less than 50 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),

    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),

    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .max(20, { message: "Phone number must be less than 15 characters long" }),

    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(50, { message: "Username must be less than 50 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(50, { message: "Password must be less than 50 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const supportSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }).max(1000, { message: "Message is too long" }),
})
