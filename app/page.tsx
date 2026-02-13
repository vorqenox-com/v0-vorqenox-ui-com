"use client"

import { useStore } from "@/lib/store"
import { Header } from "@/components/public/header"
import { TitanSlider } from "@/components/public/titan-slider"
import { PremiumSlider } from "@/components/public/premium-slider"
import { ArticlesGrid } from "@/components/public/articles-grid"
import { NetworkSection } from "@/components/public/network-section"
import { AdSlotComponent, HeavyAdOverlay } from "@/components/public/ad-slot"
import { useEffect } from "react"

export default function HomePage() {
  const { sectionOrder, silentRefresh } = useStore()

  // Silent Background Refresh (Traffic Washer)
  useEffect(() => {
    if (!silentRefresh) return
    const timer = setInterval(() => {
      // Triggers a silent page refresh cycle
      window.dispatchEvent(new CustomEvent("vorqenox:refresh"))
    }, 30000)
    return () => clearInterval(timer)
  }, [silentRefresh])

  const renderSection = (id: string) => {
    switch (id) {
      case "titan":
        return <TitanSlider key={id} />
      case "premium":
        return <PremiumSlider key={id} />
      case "ad-top":
        return <AdSlotComponent key={id} position="top" />
      case "articles":
        return <ArticlesGrid key={id} />
      case "ad-middle":
        return <AdSlotComponent key={id} position="middle" />
      case "network":
        return <NetworkSection key={id} />
      case "ad-bottom":
        return <AdSlotComponent key={id} position="bottom" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Heavy Ad Overlay */}
      <HeavyAdOverlay />

      {/* Dynamic Section Rendering */}
      <main className="flex flex-col gap-8 pb-16 pt-8">
        {sectionOrder
          .filter((s) => s.visible)
          .map((section) => renderSection(section.id))}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs text-muted-foreground">
            {"Vorqenox // All Rights Reserved // 2026"}
          </p>
        </div>
      </footer>
    </div>
  )
}
