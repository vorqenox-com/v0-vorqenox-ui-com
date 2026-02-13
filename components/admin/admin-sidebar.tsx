"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store"
import {
  LayoutDashboard,
  FileText,
  Palette,
  Activity,
  Settings,
  LogOut,
  Shield,
  Plug,
  MessageSquare,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, roles: ["super-admin", "sub-admin"] },
  { href: "/admin/articles", label: "المقالات", icon: FileText, roles: ["super-admin", "sub-admin"] },
  { href: "/admin/theme", label: "محرك السمات", icon: Palette, roles: ["super-admin"] },
  { href: "/admin/ui-master", label: "مدير الواجهة", icon: LayoutDashboard, roles: ["super-admin"] },
  { href: "/admin/traffic", label: "غسل الزيارات", icon: Activity, roles: ["super-admin", "sub-admin"] },
  { href: "/admin/expansion", label: "مركز التوسع", icon: Plug, roles: ["super-admin"] },
  { href: "/admin/social-proof", label: "الإثبات الاجتماعي", icon: MessageSquare, roles: ["super-admin"] },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings, roles: ["super-admin"] },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, logout } = useAuth()
  const { settings } = useStore()

  return (
    <aside className="glass-strong flex w-64 shrink-0 flex-col border-l border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" fill="none">
          <rect x="2" y="2" width="28" height="28" rx="6" stroke="hsl(var(--neon))" strokeWidth="2" opacity="0.8" />
          <path d="M8 12 L16 24 L24 12" stroke="hsl(var(--neon2))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="10" r="2" fill="hsl(var(--neon))" />
        </svg>
        <div>
          <span className="neon-text block font-mono text-sm font-bold tracking-wider">{settings.name}</span>
          <span className="text-[10px] text-muted-foreground">لوحة التحكم</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="border-b border-border px-5 py-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: "hsl(var(--neon) / 0.1)",
            color: "hsl(var(--neon))",
          }}
        >
          <Shield className="h-3 w-3" />
          {role === "super-admin" ? "مدير رئيسي" : "مدير فرعي"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3 overflow-y-auto">
        {NAV_ITEMS.filter((item) => role && item.roles.includes(role)).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all"
              style={{
                backgroundColor: isActive ? "hsl(var(--neon) / 0.1)" : "transparent",
                color: isActive ? "hsl(var(--neon))" : "hsl(var(--muted-foreground))",
                boxShadow: isActive ? "var(--neon-glow-sm)" : "none",
              }}
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
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors"
          style={{ color: "hsl(var(--destructive))" }}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
