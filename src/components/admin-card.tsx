import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface AdminCardProps {
  title: string
  href: string
  icon: ReactNode
  emoji: string
  variant?: ButtonProps["variant"]
  className?: string
}

export function AdminCard({ title, href, icon, emoji, variant = "default", className }: AdminCardProps) {
  return (
    <Link href={href} className="block">
      <Button variant={variant} className={cn("h-auto w-full justify-start gap-3 p-6 text-left", className)}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/20">{icon}</div>
        <div>
          <span className="text-xl">{emoji}</span> {title}
        </div>
      </Button>
    </Link>
  )
}
