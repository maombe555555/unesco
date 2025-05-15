"use client"

import {  User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 backdrop-blur supports-[backdrop-filter]:bg-blue-200">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Image src="/unesco-logo.jpg" alt="UNESCO Logo" width={40} height={40} />
            </div>
            <span className="ml-2 text-xl font-bold">UNESCO ADMIN</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-full">
                <div className="flex  items-center justify-center rounded-full bg-muted">
                  <User className="h-6 w-6" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin/dashboard/settings" className="flex w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/dashboard/settings" className="flex w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <span className="flex items-center w-full text-red-500">
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
