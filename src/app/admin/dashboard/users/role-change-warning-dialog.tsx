"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShieldAlert } from "lucide-react"

interface RoleChangeWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  currentRole: string
  newRole: string
  userName: string
}

export default function RoleChangeWarningDialog({
  open,
  onOpenChange,
  onConfirm,
  currentRole,
  newRole,
  userName,
}: RoleChangeWarningDialogProps) {
  const isPromoting = currentRole === "applicant" && newRole === "admin"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <ShieldAlert className="h-5 w-5" />
            <AlertDialogTitle>{isPromoting ? "Promote to Admin?" : "Change User Role?"}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {isPromoting ? (
              <>
                You are about to promote <strong>{userName}</strong> from <strong>Applicant</strong> to{" "}
                <strong>Admin</strong>. This will grant them full administrative privileges.
              </>
            ) : (
              <>
                You are about to change <strong>{userName}</strong>&apos;s role from <strong>{currentRole}</strong> to{" "}
                <strong>{newRole}</strong>. This will affect their permissions in the system.
              </>
            )}
          </AlertDialogDescription>
          <AlertDialogDescription className="mt-2 font-medium text-amber-600">
            Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {isPromoting ? "Yes, Promote User" : "Yes, Change Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
