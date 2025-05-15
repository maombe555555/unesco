import { z } from "zod"

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters long" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .max(50, { message: "Email must be less than 50 characters long" })
    .email({ message: "Invalid email address" }),

  subject: z
    .string()
    .min(1, { message: "Subject is required" })
    .max(100, { message: "Subject must be less than 100 characters long" }),

  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(1000, { message: "Message must be less than 1000 characters long" }),
})

export type ContactSchema = z.infer<typeof contactSchema>
