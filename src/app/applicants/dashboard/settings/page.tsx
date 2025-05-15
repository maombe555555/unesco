/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User, Shield, History } from 'lucide-react'
import { toast } from "react-hot-toast"
import ProfileForm from "./profile-form"
import SecurityForm from "./security-form"
import ActivityLog from "./activity-log"
import ProfileHeader from "./profile-header"
import { getUserProfile } from "./actions"
import type { IUser } from "@/models/User"

export default function ApplicantProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

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
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Profile Not Found</CardTitle>
            <CardDescription>Unable to load your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/applicants/dashboard")}>Return to Dashboard</Button>
            <Button variant="outline" className="ml-2" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <ProfileHeader user={user} />

      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm user={user} setUser={setUser} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityForm user={user} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
