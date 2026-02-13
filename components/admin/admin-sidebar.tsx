"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  FileText,
  Palette,
  Activity,
  Settings,
  LogOut,
  Shield,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, roles: ["super-admin", "sub-admin"] },
  { href: "/admin/articles", label: "المقالات", icon: FileText, roles: ["super-admin", "sub-admin"] },
  { href: "/admin/ui-master", label: "مدير الواجهة", icon: Palette, roles: ["super-admin"] },
  { href: "/admin/traffic", label: "غسل الزيارات", icon: Activity, roles: ["super-admin"] },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings, roles: ["super-admin"] },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, logout } = useAuth()

  return (
    <aside className="glass-strong flex w-64 shrink-0 flex-col border-l border-border">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <Shield className="h-6 w-6 text-neon" />
        <span className="neon-text font-mono text-sm font-bold tracking-wider">لوحة التحكم</span>
      </div>

      {/* Role Badge */}
      <div className="border-b border-border px-6 py-3">
        <span className="inline-flex items-center rounded-full bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
          {role === "super-admin" ? "مدير رئيسي" : "مدير فرعي"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.filter((item) => role && item.roles.includes(role)).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-neon/10 text-neon"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              style={isActive ? { boxShadow: "var(--neon-glow-sm)" } : {}}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => {
            logout()
            router.push("/")
          }}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
