"use client"

import { useStore } from "@/lib/store"
import { Shield, Mail, CheckCircle, Award, Lock } from "lucide-react"

export function Footer() {
  const { settings, friendlySites } = useStore()

  return (
    <footer className="border-t border-border bg-card/30">
      {/* Friendly Sites Row */}
      {friendlySites.length > 0 && (
        <div className="border-b border-border py-6">
          <div className="mx-auto max-w-7xl px-4">
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Friendly Sites
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {friendlySites.map((site) => (
                <a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-neon/30 hover:text-foreground"
                >
                  {site.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="border-b border-border py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4">
          <div className="trust-shimmer flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <Shield className="h-3.5 w-3.5" style={{ color: "hsl(var(--neon))" }} />
            <span className="text-xs text-muted-foreground">SSL Secured</span>
          </div>
          <div className="trust-shimmer flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <CheckCircle className="h-3.5 w-3.5" style={{ color: "hsl(var(--neon))" }} />
            <span className="text-xs text-muted-foreground">Verified Publisher</span>
          </div>
          <div className="trust-shimmer flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <Award className="h-3.5 w-3.5" style={{ color: "hsl(var(--neon2))" }} />
            <span className="text-xs text-muted-foreground">DMCA Protected</span>
          </div>
          <div className="trust-shimmer flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <Lock className="h-3.5 w-3.5" style={{ color: "hsl(var(--neon2))" }} />
            <span className="text-xs text-muted-foreground">Privacy Compliant</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <Mail className="h-3.5 w-3.5" />
              {settings.contactEmail}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</button>
            <span className="text-muted-foreground/30">|</span>
            <button className="text-xs text-muted-foreground hover:text-foreground">Terms of Service</button>
          </div>
          <p className="text-xs text-muted-foreground">
            {settings.name} {" // "} All Rights Reserved {" // "} 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
