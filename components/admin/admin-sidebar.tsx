"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store"
import {
  LayoutDashboard,
  FileText,
  Activity,
  Palette,
  ShieldCheck,
  LogOut,
  Zap,
  Sparkles,
  ChevronLeft,
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    subtitle: "Stats & Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/articles",
    label: "Article Manager",
    subtitle: "Post / Edit / Delete",
    icon: FileText,
  },
  {
    href: "/admin/traffic",
    label: "Traffic & Ads Hub",
    subtitle: "Washing & Ad Units",
    icon: Activity,
  },
  {
    href: "/admin/theme",
    label: "UI & Neon Master",
    subtitle: "Identity & Colors",
    icon: Palette,
  },
  {
    href: "/admin/security",
    label: "Security",
    subtitle: "Access & Passwords",
    icon: ShieldCheck,
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
      className={`flex shrink-0 flex-col border-r transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-72"
      }`}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Logo header */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(34, 211, 238, 0.1)",
            boxShadow: "0 0 15px rgba(34, 211, 238, 0.2)",
          }}
        >
          <Zap className="h-5 w-5 text-cyan-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span
              className="truncate text-sm font-bold tracking-wider text-cyan-400"
              style={{ textShadow: "0 0 10px rgba(34, 211, 238, 0.4)" }}
            >
              {settings.name}
            </span>
            <span className="text-[10px] text-gray-500">Nerve Center</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
            style={{
              background: "rgba(34, 211, 238, 0.08)",
              color: "rgb(34, 211, 238)",
              border: "1px solid rgba(34, 211, 238, 0.15)",
            }}
          >
            <Sparkles className="h-3 w-3" />
            {role === "super-admin" ? "Super Admin" : "Sub Admin"}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard" || pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              }`}
              style={{
                background: isActive ? "rgba(34, 211, 238, 0.08)" : "transparent",
                color: isActive ? "rgb(34, 211, 238)" : "rgb(156, 163, 175)",
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                  style={{ background: "rgb(34, 211, 238)" }}
                />
              )}

              {/* Icon container with glow */}
              <span
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  background: isActive
                    ? "rgba(34, 211, 238, 0.12)"
                    : "transparent",
                  boxShadow: isActive
                    ? "0 0 15px rgba(34, 211, 238, 0.2)"
                    : "none",
                }}
              >
                <item.icon className="h-[18px] w-[18px]" />
              </span>

              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <span className="block truncate font-medium leading-tight">
                    {item.label}
                  </span>
                  <span
                    className="block truncate text-[11px] leading-tight"
                    style={{ color: isActive ? "rgba(34, 211, 238, 0.6)" : "rgb(107, 114, 128)" }}
                  >
                    {item.subtitle}
                  </span>
                </div>
              )}

              {/* Hover glow */}
              {!isActive && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: "rgba(255, 255, 255, 0.02)" }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <button
          onClick={async () => {
            await logout()
            router.push("/admin-gateway")
          }}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-red-400 transition-all duration-200 hover:bg-red-500/10 ${
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
