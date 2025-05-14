"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, LogIn, LogOut, Settings, UserCog, Shield, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getUserActivity } from "./actions"
import toast, { ToastBar } from "react-hot-toast"

interface ActivityItem {
  _id: string
  userId: string
  type: "login" | "logout" | "password_change" | "profile_update" | "role_change" | "security_alert"
  ipAddress: string
  userAgent: string
  timestamp: string
  details?: string
}

interface ActivityLogProps {
  userId: string
}

export default function ActivityLog({ userId }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getUserActivity(userId)
        setActivities(data)
      } catch (error) {
        

        toast.error("Failed to load activity log. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [userId, toast])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />
      case "logout":
        return <LogOut className="h-4 w-4" />
      case "password_change":
        return <Shield className="h-4 w-4" />
      case "profile_update":
        return <UserCog className="h-4 w-4" />
      case "role_change":
        return <Settings className="h-4 w-4" />
      case "security_alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "login":
        return "Login"
      case "logout":
        return "Logout"
      case "password_change":
        return "Password Changed"
      case "profile_update":
        return "Profile Updated"
      case "role_change":
        return "Role Changed"
      case "security_alert":
        return "Security Alert"
      default:
        return "Activity"
    }
  }

  const getActivityVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "login":
        return "default"
      case "logout":
        return "secondary"
      case "password_change":
        return "outline"
      case "profile_update":
        return "outline"
      case "role_change":
        return "outline"
      case "security_alert":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Mock data for demonstration
  const mockActivities: ActivityItem[] = [
    {
      _id: "1",
      userId,
      type: "login",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      _id: "2",
      userId,
      type: "profile_update",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      details: "Updated profile information",
    },
    {
      _id: "3",
      userId,
      type: "password_change",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      _id: "4",
      userId,
      type: "login",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      _id: "5",
      userId,
      type: "logout",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 - 1000 * 60 * 30).toISOString(),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent account activity and security events</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-start space-x-4">
                <div className="bg-muted rounded-full p-2">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{getActivityLabel(activity.type)}</h4>
                      <Badge variant={getActivityVariant(activity.type)}>{activity.type}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  {activity.details && <p className="text-sm">{activity.details}</p>}
                  <div className="text-xs text-muted-foreground">
                    IP: {activity.ipAddress} • {activity.userAgent.substring(0, 50)}
                    {activity.userAgent.length > 50 ? "..." : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Use mock data for demonstration
          <div className="space-y-6">
            {mockActivities.map((activity) => (
              <div key={activity._id} className="flex items-start space-x-4">
                <div className="bg-muted rounded-full p-2">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{getActivityLabel(activity.type)}</h4>
                      <Badge variant={getActivityVariant(activity.type)}>{activity.type}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  {activity.details && <p className="text-sm">{activity.details}</p>}
                  <div className="text-xs text-muted-foreground">
                    IP: {activity.ipAddress} • {activity.userAgent.substring(0, 50)}
                    {activity.userAgent.length > 50 ? "..." : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
