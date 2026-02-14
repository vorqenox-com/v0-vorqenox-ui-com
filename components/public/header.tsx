"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Menu, X, Shield, ExternalLink, Mail, FileText, Lock, Home, Crown, Settings } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, socialLinks, articles } = useStore()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const filteredArticles = searchQuery.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  return (
    <>
      {/* Floating Glass Navbar */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-[1440px]">
          <nav className="flex items-center justify-between border-b border-white/5 bg-black/40 px-5 py-3 backdrop-blur-xl">
            {/* Left: Glowing Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-9 w-9 items-center justify-center">
                {/* Cyan pulse ring */}
                <span className="absolute inset-0 rounded-lg border border-cyan-400/30 animate-[neon-breathe_3s_ease-in-out_infinite]" />
                <svg viewBox="0 0 32 32" className="relative h-7 w-7 shrink-0" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="28"
                    height="28"
                    rx="6"
                    stroke="rgb(34, 211, 238)"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <path
                    d="M8 12 L16 24 L24 12"
                    stroke="rgb(34, 211, 238)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="10" r="2" fill="rgb(34, 211, 238)" />
                </svg>
              </div>
              <span className="hidden font-mono text-lg font-bold tracking-wider text-cyan-400 sm:inline drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all group-hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.7)]">
                {settings.name}
              </span>
            </Link>

            {/* Right: Search + Three-Dash Menu */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 transition-all hover:border-cyan-500/20 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                aria-label="Search articles"
              >
                <Search className="h-4.5 w-4.5 text-gray-400 transition-colors hover:text-cyan-400" />
              </button>

              {/* Three-Dash Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 transition-all hover:border-cyan-500/20 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                aria-label="Open navigation menu"
              >
                <div className="flex w-5 flex-col gap-[5px]">
                  <span className="block h-[2px] w-full rounded-full bg-gray-400 transition-colors group-hover:bg-cyan-400" />
                  <span className="block h-[2px] w-3.5 rounded-full bg-gray-400 transition-colors group-hover:bg-cyan-400" />
                  <span className="block h-[2px] w-full rounded-full bg-gray-400 transition-colors group-hover:bg-cyan-400" />
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-b border-white/5 bg-black/60 px-5 py-3 backdrop-blur-xl">
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-gray-200 placeholder:text-gray-500 backdrop-blur-md focus:border-cyan-500/30 focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery("")
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
              {filteredArticles.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl">
                  {filteredArticles.slice(0, 5).map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.id}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-white/5"
                    >
                      <span className="shrink-0 rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                        {article.category}
                      </span>
                      <span className="truncate">{article.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Slide-Over Glass Panel */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Slide-over Panel */}
          <nav
            ref={sidebarRef}
            className="relative z-10 flex w-80 flex-col border-l border-white/10 bg-black/70 backdrop-blur-2xl animate-in slide-in-from-right duration-300 sm:w-[340px]"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-cyan-400" />
                <span className="font-mono text-sm font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
                  {settings.name}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="border-b border-white/10 px-6 py-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Navigation
              </p>
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-cyan-400"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="/#premium"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-cyan-400"
                >
                  <Crown className="h-4 w-4" />
                  Premium
                </Link>
                <Link
                  href="/admin-gateway"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-cyan-400"
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="border-b border-white/10 px-6 py-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Social
              </p>
              <div className="flex flex-col gap-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-cyan-400"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="border-b border-white/10 px-6 py-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Legal
              </p>
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-cyan-400">
                  <Lock className="h-3.5 w-3.5" />
                  Privacy Policy
                </button>
                <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-cyan-400">
                  <FileText className="h-3.5 w-3.5" />
                  Terms of Service
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="px-6 py-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Contact
              </p>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-cyan-400"
              >
                <Mail className="h-3.5 w-3.5" />
                {settings.contactEmail}
              </a>
            </div>

            {/* Footer blurb */}
            <div className="mt-auto border-t border-white/10 px-6 py-5">
              <p className="text-xs leading-relaxed text-gray-500">{settings.description}</p>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
