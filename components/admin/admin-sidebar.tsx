"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store"
import {
  LayoutDashboard,
  Settings,
  Activity,
  FileText,
  Layers,
  Megaphone,
  ShieldCheck,
  LogOut,
  Zap,
  Sparkles,
  ChevronLeft,
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    roles: ["super-admin", "sub-admin"],
  },
  {
    href: "/admin/settings",
    label: "Global Settings",
    icon: Settings,
    roles: ["super-admin"],
  },
  {
    href: "/admin/traffic",
    label: "Traffic Washing Hub",
    icon: Activity,
    roles: ["super-admin", "sub-admin"],
  },
  {
    href: "/admin/articles",
    label: "Article Manager",
    icon: FileText,
    roles: ["super-admin", "sub-admin"],
  },
  {
    href: "/admin/theme",
    label: "Layout & Sliders",
    icon: Layers,
    roles: ["super-admin"],
  },
  {
    href: "/admin/ui-master",
    label: "Ad & API Engine",
    icon: Megaphone,
    roles: ["super-admin"],
  },
  {
    href: "/admin/security",
    label: "Security Settings",
    icon: ShieldCheck,
    roles: ["super-admin"],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, logout } = useAuth()
  const { settings } = useStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-white/5 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
      style={{
        background: "hsla(220, 15%, 6%, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: "hsl(var(--neon) / 0.1)",
            boxShadow: "0 0 12px hsl(var(--neon) / 0.25)",
          }}
        >
          <Zap className="h-5 w-5" style={{ color: "hsl(var(--neon))" }} />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span
              className="truncate text-sm font-bold tracking-wider"
              style={{
                color: "hsl(var(--neon))",
                textShadow: "0 0 8px hsl(var(--neon) / 0.4)",
              }}
            >
              {settings.name}
            </span>
            <span className="text-[10px] text-gray-500">Admin Panel</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-500 transition-colors hover:text-gray-300"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="border-b border-white/5 px-4 py-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
            style={{
              background: "hsl(var(--neon) / 0.08)",
              color: "hsl(var(--neon))",
              border: "1px solid hsl(var(--neon) / 0.15)",
            }}
          >
            <Sparkles className="h-3 w-3" />
            {role === "super-admin" ? "Super Admin" : "Sub Admin"}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV_ITEMS.filter((item) => role && item.roles.includes(role)).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              }`}
              style={{
                background: isActive ? "hsl(var(--neon) / 0.08)" : "transparent",
                color: isActive ? "hsl(var(--neon))" : "rgb(156, 163, 175)",
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                  style={{ background: "hsl(var(--neon))" }}
                />
              )}

              {/* Icon with glow */}
              <span
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-200"
                style={{
                  background: isActive ? "hsl(var(--neon) / 0.12)" : "transparent",
                  boxShadow: isActive ? "0 0 10px hsl(var(--neon) / 0.3)" : "none",
                }}
              >
                <item.icon className="h-[18px] w-[18px]" />
              </span>

              {!collapsed && (
                <span className="truncate font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/5 p-3">
        <button
          onClick={() => {
            logout()
            router.push("/")
          }}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
