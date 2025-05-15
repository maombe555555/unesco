"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Mail } from "lucide-react"

const resendSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
})

type ResendFormValues = z.infer<typeof resendSchema>

export default function ResendVerification() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(() => {
    // Check if we have a pending verification email from the login attempt
    const pendingEmail = sessionStorage.getItem("pendingVerificationEmail")
    if (pendingEmail) {
      form.setValue("email", pendingEmail)
      // Clear it after using
      sessionStorage.removeItem("pendingVerificationEmail")
    }
  }, [form])

  async function onSubmit(data: ResendFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to resend verification email")
        setIsLoading(false)
        return
      }

      toast.success("Verification email sent! Please check your inbox.")
      router.push("/login?success=Verification email sent! Please check your inbox.")
    } catch (error) {
     console.error("Error resending verification email:", error)
      toast.error("An error occurred while sending the verification email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#0077D4] p-2">
            <Image
              src="/unesco-logo.jpg"
              alt="UNESCO Logo"
              width={50}
              height={50}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold text-blue-600">Resend Verification Email</CardTitle>
            <CardDescription className="text-center">
              Enter your email address to receive a new verification link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} UNESCO Participation Programme. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
