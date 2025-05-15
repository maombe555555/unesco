/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, LogIn, LogOut, Settings, Shield, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getUserActivityLog } from "./actions"
import type { IUser } from "@/models/User"
import { toast } from "react-hot-toast"

interface ActivityLogProps {
  user: IUser
}

interface ActivityItem {
  _id: string
  userId: string
  action: string
  ipAddress: string
  userAgent: string
  timestamp: string
  details?: string
}

export default function ActivityLog({ user }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchActivities = async (pageNum = 1, append = false) => {
    setLoading(true)
    try {
      const result = await getUserActivityLog(String(user._id), pageNum)
      if (append) {
        setActivities([...activities, ...result.activities])
      } else {
        setActivities(result.activities)
      }
      setHasMore(result.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error("Error fetching activity log:", error)
      toast.error("Failed to load activity log")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [user._id])

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchActivities(page + 1, true)
    }
  }

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LogIn className="h-4 w-4" />
      case "logout":
        return <LogOut className="h-4 w-4" />
      case "profile_update":
        return <Settings className="h-4 w-4" />
      case "password_change":
        return <Shield className="h-4 w-4" />
      case "email_verification":
        return <Mail className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActivityLabel = (action: string) => {
    switch (action) {
      case "login":
        return "Login"
      case "logout":
        return "Logout"
      case "profile_update":
        return "Profile Update"
      case "password_change":
        return "Password Change"
      case "email_verification":
        return "Email Verification"
      default:
        return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }
  }

  const getBadgeVariant = (action: string) => {
    switch (action) {
      case "login":
        return "default"
      case "logout":
        return "secondary"
      case "profile_update":
        return "outline"
      case "password_change":
        return "destructive"
      case "email_verification":
        return "success"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent activity on your account</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={() => fetchActivities()} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="bg-muted rounded-full p-2">{getActivityIcon(activity.action)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{getActivityLabel(activity.action)}</h4>
                      <Badge variant={getBadgeVariant(activity.action)}>{getActivityLabel(activity.action)}</Badge>
                    </div>
                    <time className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</time>
                  </div>
                  {activity.details && <p className="text-sm text-muted-foreground">{activity.details}</p>}
                  <div className="text-xs text-muted-foreground mt-1">
                    <span>IP: {activity.ipAddress}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.userAgent}</span>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="text-center pt-2">
                <Button variant="outline" onClick={loadMore} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
