"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import ProfileForm from "./profile-form"
import SecurityForm from "./security-form"
import ActivityLog from "./activity-log"
import PreferencesForm from "./preferences-form"
import { getUserProfile } from "./actions"
import type { IUser } from "@/models/User"
import toast from "react-hot-toast"

export default function ApplicantProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile()
        setUser(userData)
      } catch (error: any) {
        console.error("Profile fetch error:", error)
        setError(error.message || "Failed to load profile")
       
        toast.error("Failed to load profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Unable to load your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/applicants/dashboard")}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                {/* <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.names} /> */}
                <AvatarFallback className="text-lg">{getInitials(user.names)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-center">{user.names}</CardTitle>
              <CardDescription className="text-center capitalize">{user.role}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Status:</span>
                <span className={`font-medium ${user.isEmailVerified ? "text-green-500" : "text-amber-500"}`}>
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since:</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm user={user} setUser={setUser} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityForm user={user} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityLog userId={user._id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
