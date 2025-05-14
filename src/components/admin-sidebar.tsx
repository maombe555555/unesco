"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ADMIN_NAVIGATION, ADMIN_FOOTER_NAVIGATION } from "@/constants/admin-navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden h-[calc(100vh-4rem)] w-64 flex-shrink-0 flex-col border-r bg-card p-6 md:flex">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Admin Dashboard</h3>
        <p className="text-sm text-muted-foreground">UNESCO Programme 2024-2025</p>
      </div>

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
                {item.emoji} {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t">
        {ADMIN_FOOTER_NAVIGATION.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span>
              {item.emoji} {item.name}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
