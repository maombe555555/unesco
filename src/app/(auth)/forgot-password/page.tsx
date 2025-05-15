"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Mail } from 'lucide-react'
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/lib/validations/auth"


export default function ForgotPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to process your request")
        setIsLoading(false)
        return
      }

      // Always show success even if email doesn't exist (security best practice)
      setEmailSent(true)
      toast.success("If your email exists in our system, you will receive a password reset link shortly")
    } catch (error) {
      console.error("Error during password reset request:", error)
      toast.error("An error occurred while processing your request")
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
            <CardTitle className="text-center text-2xl font-bold text-blue-600">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we&lsquo;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-gray-500">
                  We&apos;ve sent a password reset link to your email address. The link will expire in 1 hour.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    router.push("/login")
                  }}
                >
                  Back to login
                </Button>
              </div>
            ) : (
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
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            )}
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
