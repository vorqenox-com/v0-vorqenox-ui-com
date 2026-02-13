"use client"

import { useStore } from "@/lib/store"

interface AdSlotProps {
  position: "top" | "middle" | "bottom"
}

export function AdSlotComponent({ position }: AdSlotProps) {
  const { adSlots } = useStore()

  // If Heavy Ad is active, hide regular ads
  const heavyAd = adSlots.find((a) => a.position === "heavy" && a.active)
  if (heavyAd) return null

  const ad = adSlots.find((a) => a.position === position && a.active)
  if (!ad) return null

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-4 py-6">
        <span className="text-xs text-muted-foreground">
          {ad.content} - Ad Slot ({position})
        </span>
      </div>
    </div>
  )
}

export function HeavyAdOverlay() {
  const { adSlots } = useStore()
  const heavyAd = adSlots.find((a) => a.position === "heavy" && a.active)

  if (!heavyAd) return null

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div
        className="glass flex items-center justify-center rounded-xl py-20"
        style={{ boxShadow: "var(--neon-glow-lg)" }}
      >
        <div className="text-center">
          <p className="neon-text text-lg font-bold">{heavyAd.content}</p>
          <span className="mt-1 block text-xs text-muted-foreground">Heavy Advertisement</span>
        </div>
      </div>
    </div>
  )
}
