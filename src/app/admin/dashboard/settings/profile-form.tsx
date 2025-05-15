/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { updateProfile } from "./actions"
import type { IUser } from "@/models/User"
import { toast } from "react-hot-toast"

const profileFormSchema = z.object({
  names: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  bio: z.string().optional(),
  organization: z.string().optional(),
  position: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  user: IUser
  setUser: (user: IUser) => void
}

export default function ProfileForm({ user, setUser }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailChanged, setEmailChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      names: user.names,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
      organization: user.organization || "",
      position: user.position || "",
    },
  })

  const watchEmail = form.watch("email")

  // Check if email has changed
  if (watchEmail !== user.email && !emailChanged) {
    setEmailChanged(true)
  } else if (watchEmail === user.email && emailChanged) {
    setEmailChanged(false)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to a server
      // For now, we'll just create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      // In a real implementation, you would handle the avatar upload here
      const updatedUser = await updateProfile({
        ...data,
        userId: user._id as string,
        avatarUrl: avatarPreview || undefined,
      })

      setUser(updatedUser)

      toast.success("Profile updated successfully")

      if (emailChanged) {
        toast.success("A verification email has been sent to your new email address")
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get initials from user's name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal information and contact details</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b">
              <div className="relative group">
                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={avatarPreview || ""} alt={user.names} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {getInitials(user.names)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">Profile Picture</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click on the avatar to upload a new profile picture. JPG, GIF or PNG. Max size 1MB.
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
                    Upload New Picture
                  </Button>
                  {avatarPreview && avatarPreview !== user.avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAvatarPreview(user.avatarUrl || null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {emailChanged && (
              <Alert variant="default" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Email Change Notice</AlertTitle>
                <AlertDescription>
                  Changing your email will require verification. A verification link will be sent to your new email
                  address.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="names"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position/Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us a little about yourself"
                        className="resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex mt-4 justify-between">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
