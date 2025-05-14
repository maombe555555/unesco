"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DASHBOARD_NAVIGATION, FOOTER_NAVIGATION } from "@/constants/navigation"
import { Button } from "./ui/button"

export function DashboardSidebar() {
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
    <aside className="hidden h-[calc(100vh-4rem)] w-fit flex-shrink-0 flex-col border-r bg-gray-200 p-6 md:flex">

      <nav className="flex-1 space-y-1">
        {DASHBOARD_NAVIGATION.map((item) => {
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
              {item.name}
              {item.name === "My Applications" && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium">
                  3
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t">
        {FOOTER_NAVIGATION.map((item) => (
           <Button variant={"ghost"}
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
