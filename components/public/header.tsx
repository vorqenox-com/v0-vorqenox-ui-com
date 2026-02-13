"use client"

import { useState } from "react"
import { Search, Menu, X, Shield, ExternalLink, Mail, FileText, Lock } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, socialLinks, articles } = useStore()

  const filteredArticles = searchQuery.trim()
    ? articles.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <>
      <header className="glass-strong sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>

          {/* Dynamic Logo (live text from settings) */}
          <Link href="/" className="flex items-center gap-2">
            {/* SVG Logo that updates from dashboard */}
            <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="hsl(var(--neon))" strokeWidth="2" opacity="0.8" />
              <path d="M8 12 L16 24 L24 12" stroke="hsl(var(--neon2))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="10" r="2" fill="hsl(var(--neon))" />
            </svg>
            <span className="neon-text hidden font-mono text-lg font-bold tracking-wider sm:inline">
              {settings.name}
            </span>
          </Link>

          <div className="flex-1" />

          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Expandable Search */}
        {searchOpen && (
          <div className="border-t border-border px-4 py-3">
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-lg border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon focus:outline-none"
                autoFocus
              />
              {filteredArticles.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-border bg-card shadow-lg">
                  {filteredArticles.slice(0, 5).map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <span className="text-xs text-neon">{article.category}</span>
                      <span>{article.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <nav className="glass-strong relative z-10 flex w-80 flex-col border-r border-border">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" style={{ color: "hsl(var(--neon))" }} />
                <span className="neon-text font-mono text-sm font-bold tracking-widest">{settings.name}</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>

            {/* Social Links */}
            <div className="border-b border-border px-6 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Social</p>
              <div className="flex flex-col gap-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="border-b border-border px-6 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Policies</p>
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Privacy Policy
                </button>
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Terms of Service
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="px-6 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Contact</p>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                {settings.contactEmail}
              </a>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-border px-6 py-4">
              <p className="text-xs text-muted-foreground">{settings.description}</p>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
