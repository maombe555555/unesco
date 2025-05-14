import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Server-side authentication check using the session utility
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has applicant role
  if (session.role !== "applicant") {
    // If not applicant but has admin role, redirect to admin dashboard
    if (session.role === "admin") {
      redirect("/admin")
    } else {
      // If neither applicant nor admin, redirect to login
      redirect("/login")
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between md:hidden">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <MobileSidebar />
              </div>

              {children}
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
