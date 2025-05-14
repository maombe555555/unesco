import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileSidebar } from "@/components/admin/admin-mobile-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Server-side authentication check using the session utility
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has admin role
  if (session.role !== "admin") {
    // If not admin but has applicant role, redirect to applicant dashboard
    if (session.role === "applicant") {
      redirect("/applicants/dashboard")
    } else {
      // If neither admin nor applicant, redirect to login
      redirect("/login")
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <AdminHeader />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between md:hidden">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <AdminMobileSidebar />
              </div>

              {children}
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
