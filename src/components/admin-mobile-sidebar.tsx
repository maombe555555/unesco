"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ADMIN_NAVIGATION, ADMIN_FOOTER_NAVIGATION } from "@/constants/admin-navigation"

export function AdminMobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Admin Dashboard</h3>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {ADMIN_NAVIGATION.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
                  )}
                >
                  <item.icon
                    className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")}
                  />
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
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {item.emoji} {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
