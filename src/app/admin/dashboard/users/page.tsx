import type { Metadata } from "next"
import { getSession } from "@/lib/utils/sessionutil"
import { forbidden } from "next/navigation"
import { DataTable } from "./users-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { IUser } from "@/models/User"

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

  // Define columns for the DataTable
  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "names",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("names")}</div>,
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <Badge variant={role === "admin" ? "default" : "outline"}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "isEmailVerified",
      header: "Email Verified",
      cell: ({ row }) => {
        const isVerified = row.getValue("isEmailVerified") as boolean
        return (
          <Badge variant={isVerified ? "success" : "destructive"}>{isVerified ? "Verified" : "Not Verified"}</Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div>{formatDistanceToNow(date, { addSuffix: true })}</div>
      },
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all users in the system</p>
      </div>
      <DataTable columns={columns} />
    </div>
  )
}
