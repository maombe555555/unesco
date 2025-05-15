/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Eye, EyeOff, KeyRound, ShieldAlert, ShieldCheck } from "lucide-react"
import { changePassword, toggleTwoFactorAuth, getActiveSessions, revokeSession } from "./actions"
import type { IUser } from "@/models/User"
import { toast } from "react-hot-toast"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

interface SecurityFormProps {
  user: IUser
}

export default function SecurityForm({ user }: SecurityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled || false)
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false)
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [isRevokingSession, setIsRevokingSession] = useState<string | null>(null)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true)
    try {
      await changePassword({
        userId: String(user._id),
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      form.reset()
      toast.success("Password updated successfully")
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error(error.message || "Failed to change password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTwoFactorToggle = async (checked: boolean) => {
    setIsTwoFactorLoading(true)
    try {
      await toggleTwoFactorAuth({
        userId: String(user._id),
        enabled: checked,
      })
      setTwoFactorEnabled(checked)
      toast.success(checked ? "Two-factor authentication enabled" : "Two-factor authentication disabled")
    } catch (error: any) {
      console.error("Error toggling 2FA:", error)
      toast.error(error.message || "Failed to update two-factor authentication")
    } finally {
      setIsTwoFactorLoading(false)
    }
  }

  const loadActiveSessions = async () => {
    setIsLoadingSessions(true)
    try {
      const sessions = await getActiveSessions(String(user._id))
      setActiveSessions(sessions)
    } catch (error: any) {
      console.error("Error loading sessions:", error)
      toast.error("Failed to load active sessions")
    } finally {
      setIsLoadingSessions(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    setIsRevokingSession(sessionId)
    try {
      await revokeSession(sessionId)
      setActiveSessions(activeSessions.filter((session) => session._id !== sessionId))
      toast.success("Session revoked successfully")
    } catch (error: any) {
      console.error("Error revoking session:", error)
      toast.error("Failed to revoke session")
    } finally {
      setIsRevokingSession(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showCurrentPassword ? "text" : "password"} {...field} className="pr-10" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showNewPassword ? "text" : "password"} {...field} className="pr-10" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters and include uppercase, lowercase, numbers, and special
                      characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showConfirmPassword ? "text" : "password"} {...field} className="pr-10" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-4">
              <Button type="submit" disabled={isSubmitting} className="ml-auto ">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {twoFactorEnabled ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-500" />
            )}
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by enabling two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">
                {twoFactorEnabled ? "Two-factor authentication is enabled" : "Two-factor authentication is disabled"}
              </p>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled
                  ? "Your account is protected with an additional layer of security."
                  : "Protect your account with an additional layer of security."}
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} disabled={isTwoFactorLoading} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent>
          {activeSessions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No active sessions to display</p>
              <Button variant="outline" onClick={loadActiveSessions} disabled={isLoadingSessions} className="mt-4">
                {isLoadingSessions ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load Active Sessions"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">{session.deviceInfo || "Unknown Device"}</p>
                    <p className="text-sm text-muted-foreground">
                      Last active: {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokeSession(session._id)}
                    disabled={isRevokingSession === session._id}
                  >
                    {isRevokingSession === session._id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Revoke"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
