"use client"

import Link from "next/link"
import { Bell, FileText, FilePlus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/dashboard-card"

export default function ApplicantDashboard() {
  return (
    <div className="min-h-screen bg-background">


      <div className="flex">


        <main className="flex-1 p-6">
          <div className="flex items-center justify-between md:hidden">
            <h1 className="text-2xl font-bold">Dashboard</h1>
      
          </div>

          <div className="mt-6">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
            <p className="mt-2 text-muted-foreground">
              Here's an overview of your application status and recent activities.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="My Applications"
              description="Track your submitted applications"
              icon={<FileText className="h-5 w-5 text-primary" />}
            >
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold">3</span>
                <Link href="/applicants/dashboard/application">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard
              title="New Application"
              description="Start a new application process"
              icon={<FilePlus className="h-5 w-5 text-primary" />}
            >
              <Link href="/applicants/dashboard/new-application">
                <Button className="mt-2 w-full">Create New Application</Button>
              </Link>
            </DashboardCard>

            <DashboardCard
              title="Profile"
              description="Update your personal information"
              icon={<User className="h-5 w-5 text-primary" />}
            >
              <Link href="/applicants/dashboard/Profile">
                <Button variant="outline" className="mt-2 w-full">
                  Edit Profile
                </Button>
              </Link>
            </DashboardCard>
          </div>

          <div className="mt-8">
            <DashboardCard
              title="Notifications"
              description="Receive all updates about your application status via email"
              icon={<Bell className="h-5 w-5 text-primary" />}
            >
      
            </DashboardCard>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <div className="mt-4 rounded-lg border">
              <div className="divide-y">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">Application #{item} updated</p>
                      <p className="text-sm text-muted-foreground">Status changed to "Under Review"</p>
                    </div>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
