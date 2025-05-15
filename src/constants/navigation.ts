import { Home, FileText, FilePlus, Settings, LogOut } from "lucide-react"

export const DASHBOARD_NAVIGATION = [
  {
    name: "Dashboard",
    href: "/applicants/dashboard",
    icon: Home,
  },
  {
    name: "Applications",
    href: "/applicants/dashboard/application",
    icon: FileText,
  },
  {
    name: "New Application",
    href: "/applicants/dashboard/new-application",
    icon: FilePlus,
  },
  {
    name: "Settings",
    href: "/applicants/dashboard/settings",
    icon: Settings,
  },
  
]

export const FOOTER_NAVIGATION = [
  {
    name: "Logout",
    href: "/",
    icon: LogOut,
  },
]
