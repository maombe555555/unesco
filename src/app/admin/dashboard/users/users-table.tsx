/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllUsers } from "@/app/actions/user-actions"
import { useEffect, useState } from "react"
import type { IUser } from "@/models/User"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { deleteUser } from "@/app/actions/user-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import EditUserDialog from "./edit-user-dialog"


// Define a simpler type that only includes the properties we need
type EditableUser = {
  _id: string
  names: string
  username: string
  email: string
  phone: string
  password: string
  role: string
  isEmailVerified: boolean
  verificationToken?: string
  verificationTokenExpiry?: Date
  resetPasswordToken?: string
  resetPasswordTokenExpiry?: Date
  avatarUrl?: string
  bio?: string
  organization?: string
  position?: string
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  createdAt: Date
  updatedAt: Date
}

interface Props {
  columns: ColumnDef<IUser>[]
}

export function DataTable({ columns }: Props) {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<EditableUser | null>(null)

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        // Ensure each user object matches the IUser interface
        const usersData = data.map((user: any) => ({
          _id: user._id,
          names: user.names ?? "",
          username: user.username ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          role: user.role ?? "applicant",
          isEmailVerified: user.isEmailVerified ?? false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v,
          // Add other IUser properties here as needed, with sensible defaults
        }))
        setUsers(usersData as unknown as IUser[])
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = async () => {
    if (userIdToDelete) {
      try {
        await deleteUser(userIdToDelete)
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userIdToDelete))
        toast.success("User deleted successfully.")
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("Failed to delete user. Please try again.")
      } finally {
        setIsDeleteDialogOpen(false)
        setUserIdToDelete(null)
      }
    }
  }

  const handleEditUser = (user: IUser) => {
    // Convert the Mongoose document to a plain object
    const plainUser = {
      _id: user._id,
      names: user.names,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      verificationToken: user.verificationToken,
      verificationTokenExpiry: user.verificationTokenExpiry,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordTokenExpiry: user.resetPasswordTokenExpiry,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      organization: user.organization,
      position: user.position,
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorSecret: user.twoFactorSecret,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    setUserToEdit(plainUser as EditableUser)
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>A list of your recent users.</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  )
                })}
                <TableCell className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditUser(row.original)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setIsDeleteDialogOpen(true)
                          setUserIdToDelete(String(row.original._id))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the user from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          {/* Pagination controls */}
          <TableRow>
            <TableCell colSpan={columns.length}>
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={userToEdit as IUser}      
        onUserUpdated={(updatedUser) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
          )
        }}
      />
    </div>
  )
}
