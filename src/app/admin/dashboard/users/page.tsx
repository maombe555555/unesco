import type { Metadata } from "next"
import { getSession } from "@/lib/utils/sessionutil"
import { forbidden } from "next/navigation"
import UsersTable from "./users-table"

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage all users in the system",
}

export default async function UsersPage() {
  // Verify admin access
  const session = await getSession()

  if (!session || session.role !== "admin") {
    forbidden()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all users in the system</p>
      </div>
      <UsersTable />
    </div>
  )
}
