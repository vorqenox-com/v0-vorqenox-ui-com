"use client"

import { useStore } from "@/lib/store"
import { Shield, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const { settings, socialLinks, friendlySites } = useStore()

  return (
    <footer className="relative border-t border-cyan-500/10">
      {/* Neon Top-Border Glow Line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm" />

      {/* Friendly Sites Row */}
      {friendlySites.length > 0 && (
        <div className="border-b border-white/5 py-6">
          <div className="mx-auto max-w-6xl px-4">
            <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Friendly Sites
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {friendlySites.map((site) => (
                <a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2 text-xs text-gray-500 transition-all hover:border-cyan-500/20 hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.08)]"
                >
                  {site.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Professional 3-Column Grid */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: About + Social */}
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="font-mono text-sm font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
                {settings.name}
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              {settings.description}
            </p>

            {/* Social Links */}
            <div className="flex flex-col gap-1.5">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-400 transition-all hover:text-cyan-400"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  {link.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-gray-400 transition-colors hover:text-cyan-400"
              >
                Home
              </Link>
              <Link
                href="/#premium"
                className="text-sm text-gray-400 transition-colors hover:text-cyan-400"
              >
                Premium
              </Link>
              <Link
                href="/admin-gateway"
                className="text-sm text-gray-400 transition-colors hover:text-cyan-400"
              >
                Admin
              </Link>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-cyan-400"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {settings.contactEmail}
              </a>
            </div>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              <button className="text-left text-sm text-gray-400 transition-colors hover:text-cyan-400">
                Privacy Policy
              </button>
              <button className="text-left text-sm text-gray-400 transition-colors hover:text-cyan-400">
                Terms of Service
              </button>
              <button className="text-left text-sm text-gray-400 transition-colors hover:text-cyan-400">
                DMCA
              </button>
              <button className="text-left text-sm text-gray-400 transition-colors hover:text-cyan-400">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-600">
            {settings.name} // All Rights Reserved // 2026
          </p>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500/60 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
