import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  description?: string
  icon?: ReactNode
  className?: string
  children?: ReactNode
}

export function DashboardCard({ title, description, icon, className, children }: DashboardCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">{icon}</div>}
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
