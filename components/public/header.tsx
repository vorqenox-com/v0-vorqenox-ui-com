"use client"

import { useState } from "react"
import { Search, Menu, X, Shield } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { settings } = useStore()

  return (
    <>
      <header className="glass-strong sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="neon-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
          >
            <Menu className="h-5 w-5 text-foreground" />
            <span className="sr-only">Toggle navigation</span>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-neon" />
            <span className="neon-text hidden font-mono text-lg font-bold tracking-wider sm:inline">
              {settings.name}
            </span>
          </Link>

          {/* Search Bar */}
          <div className="relative ml-auto max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
            />
          </div>

          {/* Admin Link */}
          <Link
            href="/login"
            className="neon-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Shield className="h-5 w-5" />
            <span className="sr-only">Admin Login</span>
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <nav className="glass-strong relative z-10 flex w-72 flex-col border-r border-border p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="neon-text font-mono text-sm font-bold tracking-widest">NAVIGATION</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {["Home", "Technology", "Science", "Security", "AI", "Blockchain"].map((item) => (
                <Link
                  key={item}
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
