import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IUser } from "@/models/User"

interface ProfileHeaderProps {
  user: IUser
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
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
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={user.avatarUrl || ""} alt={user.names} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {getInitials(user.names)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{user.names}</h1>
              <div className="flex justify-center md:justify-start gap-2">
                <Badge variant={user.isEmailVerified ? "success" : "warning"} className="ml-0 md:ml-2">
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">@{user.username}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{user.phone || "Not provided"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
