"use client"

import { Users, FolderKanban, Calculator, Settings, Bell, User } from "lucide-react"
import { AdminMobileSidebar } from "@/components/admin/admin-mobile-sidebar"
import { AdminCard } from "@/components/admin/admin-card"

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between md:hidden mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <AdminMobileSidebar />
      </div>

      <div className="mt-6">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to the UNESCO Admin Dashboard</h2>
        <p className="mt-2 text-muted-foreground">
          This panel supports all administrative tasks for the <strong>UNESCO Participation Programme 2024-2025</strong>
          : reviewing applicant projects, editing data, assigning marks with explanations, managing notifications, and
          updating profile settings.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminCard
          title="Manage Applicants"
          href="/admin/Dashboard/application"
          icon={<Users className="h-5 w-5 text-primary-foreground" />}
          emoji="📋"
          className="bg-primary hover:bg-primary/90"
        />

        <AdminCard
          title="View & Delete Projects"
          href="/admin/Dashboard/viewdelete"
          icon={<FolderKanban className="h-5 w-5 text-primary-foreground" />}
          emoji="🗂️"
          variant="secondary"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        />

        <AdminCard
          title="Assign Marks & Add Notes"
          href="/Admin/Dashboard/assigview"
          icon={<Calculator className="h-5 w-5 text-primary-foreground" />}
          emoji="🧮"
          variant="secondary"
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        />

        <AdminCard
          title="Settings"
          href="/admin/dashboard/setting"
          icon={<Settings className="h-5 w-5 text-primary-foreground" />}
          emoji="⚙️"
          variant="secondary"
          className="bg-gray-700 hover:bg-gray-800 text-white"
        />

        <AdminCard
          title="Notifications"
          href="/admin/Adashboard/Message"
          icon={<Bell className="h-5 w-5 text-primary-foreground" />}
          emoji="🔔"
          variant="secondary"
          className="bg-pink-600 hover:bg-pink-700 text-white"
        />

        <AdminCard
          title="Edit Profile"
          href="/Admin/Adashboard/profile"
          icon={<User className="h-5 w-5 text-primary-foreground" />}
          emoji="👤"
          variant="secondary"
          className="bg-green-600 hover:bg-green-700 text-white"
        />
      </div>

      <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">New applicant registered</p>
              <p className="text-sm text-muted-foreground">John Doe from Ghana submitted a new application</p>
            </div>
            <p className="text-sm text-muted-foreground">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">Project evaluation completed</p>
              <p className="text-sm text-muted-foreground">Project #1234 has been evaluated with a score of 85/100</p>
            </div>
            <p className="text-sm text-muted-foreground">Yesterday</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System update scheduled</p>
              <p className="text-sm text-muted-foreground">Maintenance window planned for next Sunday</p>
            </div>
            <p className="text-sm text-muted-foreground">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
