import { Home, FileText, FilePlus, User, LogOut } from "lucide-react"

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
    name: "Profile",
    href: "/applicants/dashboard/profile",
    icon: User,
  },
  
]

export const FOOTER_NAVIGATION = [
  {
    name: "Logout",
    href: "/",
    icon: LogOut,
  },
]
