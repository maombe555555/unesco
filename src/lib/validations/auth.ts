import { z } from "zod";

// Register Schema
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

    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),

    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .max(20, { message: "Phone number must be less than 15 characters long" })
    //   .regex(/^\+?[0-9]{10,15}$/, { message: "Invalid phone number" })
      ,

    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(50, { message: "Username must be less than 50 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });



  // Login Schema
  export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email is required" })
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

  rememberMe: z
    .boolean()
    .optional(),

});



// Forgot Password Schema  
 export const forgotPasswordSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  })
  

// Reset Password Schema
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
    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })





  export type RegisterFormValues = z.infer<typeof registerSchema>  
  export type LoginFormValues = z.infer<typeof loginSchema>
  export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
  export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
