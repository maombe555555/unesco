"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EditUserDialog from "./edit-user-dialog"
import DeleteUserDialog from "./delete-user-dialog"
import RoleChangeWarningDialog from "./role-change-warning-dialog"
import type { IUser } from "@/models/User"
import { getAllUsers, updateUser } from "@/app/actions/user-actions"
import toast from "react-hot-toast"

export default function UsersTable() {
  const router = useRouter()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showRoleWarning, setShowRoleWarning] = useState(false)
  const [pendingRoleChange, setPendingRoleChange] = useState<{ user: IUser; newRole: string } | null>(null)

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data)
      } catch (error) {
       

        toast.error("Failed to load users. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  const handleEditUser = (user: IUser) => {
    setUserToEdit({ ...user }) // Create a new object to ensure state update
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: IUser) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleUserUpdated = (updatedUser: IUser) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
    setIsEditDialogOpen(false)
    router.refresh()
    toast.success("User updated successfully.")
  }

  const handleUserDeleted = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId))
    setIsDeleteDialogOpen(false)
    router.refresh()
    toast.success("User deleted successfully.")
  }

  const handleRoleChange = (user: IUser, newRole: string) => {
    if (newRole !== user.role) {
      setPendingRoleChange({ user, newRole })
      setShowRoleWarning(true)
    }
  }

  const handleRoleChangeConfirmed = async () => {
    if (!pendingRoleChange) return

    try {
      const { user, newRole } = pendingRoleChange
      const updatedUser = await updateUser({
        userId: user._id,
        userData: {
          ...user,
          role: newRole,
        },
      })

      setUsers((prevUsers) => prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u)))

     toast.success("User role updated successfully.")
    } catch (error) {
      
      toast.error("Failed to update user role. Please try again.")
    } finally {
      setShowRoleWarning(false)
      setPendingRoleChange(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email Verified</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.names}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Select defaultValue={user.role} onValueChange={(value) => handleRoleChange(user, value)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applicant">Applicant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isEmailVerified ? "success" : "destructive"}>
                    {user.isEmailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {userToEdit && (
        <EditUserDialog
          user={userToEdit}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {userToDelete && (
        <DeleteUserDialog
          user={userToDelete}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onUserDeleted={handleUserDeleted}
        />
      )}

      {pendingRoleChange && (
        <RoleChangeWarningDialog
          open={showRoleWarning}
          onOpenChange={setShowRoleWarning}
          onConfirm={handleRoleChangeConfirmed}
          currentRole={pendingRoleChange.user.role}
          newRole={pendingRoleChange.newRole}
          userName={pendingRoleChange.user.names}
        />
      )}
    </div>
  )
}
