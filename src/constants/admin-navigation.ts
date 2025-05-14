import { Users, Home, FolderKanban, Calculator, Settings, Bell, User, LogOut, FileInput, UserCog } from "lucide-react"

export const ADMIN_NAVIGATION = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
    emoji: "🏠",
  },
  {
    name: "Users",
    href: "/admin/dashboard/users",
    icon: UserCog,
    emoji: "👥",
  },
  
  {
    name: "Applications",
    href: "/admin/dashboard/application",
    icon: FileInput,
    emoji: "📋",
  },
 
  {
    name: "Marks",
    href: "/admin/dashboard/marks",
    icon: Calculator,
    emoji: "🧮",
  },
  {
    name: "Settings",
    href: "/admin/dashboard/setting",
    icon: Settings,
    emoji: "⚙️",
  },
  {
    name: "sheet",
    href: "/admin/dashboard/sheet",
    icon: Bell,
    emoji: "🗂️",
  },
  {
    name: "Messages",
    href: "/admin/dashboard/message",
    icon: Bell,
    emoji: "🔔",
  },
  {
    name: "Profile",
    href: "/admin/dashboard/profile",
    icon: User,
    emoji: "👤",
  },
]

export const ADMIN_FOOTER_NAVIGATION = [
  {
    name: "Logout",
    href: "/",
    icon: LogOut,
    emoji: "🚪",
  },
]
