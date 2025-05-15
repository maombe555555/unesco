"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ADMIN_NAVIGATION, ADMIN_FOOTER_NAVIGATION } from "@/constants/admin-navigation"
import { Button } from "../ui/button"

export function AdminSidebar() {
  const pathname = usePathname()

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
    <aside className="hidden h-[calc(100vh-4rem)] w-fit flex-shrink-0 flex-col border-r bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 p-6 md:flex">
   
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {ADMIN_NAVIGATION.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              <span>
  {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t">
        {ADMIN_FOOTER_NAVIGATION.map((item) => (
          <Button
            key={item.name}
            variant={"ghost"}
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-200 transition-colors"
          >
            <item.icon className="h-4 w-4 text-red-500" />
            <span className="text-red-500 hover:text-red-500">
            {item.name}
            </span>
          </Button>
        ))}
      </div>
    </aside>
  )
}
