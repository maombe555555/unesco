"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { IUser } from "@/models/User"
import { updateUser } from "@/app/actions/user-actions"
import RoleChangeWarningDialog from "./role-change-warning-dialog"

const formSchema = z.object({
  names: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.enum(["applicant", "admin"]),
  isEmailVerified: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface EditUserDialogProps {
  user: IUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: (user: IUser) => void
}

export default function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRoleWarning, setShowRoleWarning] = useState(false)
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: user.names,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role as "applicant" | "admin",
      isEmailVerified: user.isEmailVerified,
    },
  })

  const onSubmit = async (values: FormValues) => {
    // If role is changing, show warning dialog
    if (values.role !== user.role) {
      setPendingValues(values)
      setShowRoleWarning(true)
      return
    }

    // Otherwise proceed with update
    await submitUpdate(values)
  }

  const submitUpdate = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const updatedUser = await updateUser({
        userId: user._id,
        userData: values,
      })
      onUserUpdated(updatedUser)
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      setIsSubmitting(false)
      setPendingValues(null)
    }
  }

  const handleRoleChangeConfirmed = async () => {
    if (pendingValues) {
      await submitUpdate(pendingValues)
      setShowRoleWarning(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="names"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="applicant">Applicant</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isEmailVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Email Verified</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <RoleChangeWarningDialog
        open={showRoleWarning}
        onOpenChange={setShowRoleWarning}
        onConfirm={handleRoleChangeConfirmed}
        currentRole={user.role}
        newRole={pendingValues?.role || user.role}
        userName={user.names}
      />
    </>
  )
}
