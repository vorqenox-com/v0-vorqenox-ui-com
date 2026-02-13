"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface NeonConfig {
  primaryHue: number
  secondaryHue: number
  glowIntensity: "low" | "medium" | "high"
  goldMode: boolean
  preset: string
}

interface NeonContextType {
  config: NeonConfig
  setConfig: (config: Partial<NeonConfig>) => void
  applyPreset: (preset: string) => void
}

const PRESETS: Record<string, { primaryHue: number; secondaryHue: number; goldMode: boolean }> = {
  "cyber-cyan": { primaryHue: 185, secondaryHue: 210, goldMode: false },
  "gold-edition": { primaryHue: 45, secondaryHue: 30, goldMode: true },
  "emerald-prime": { primaryHue: 145, secondaryHue: 170, goldMode: false },
  "crimson-volt": { primaryHue: 0, secondaryHue: 330, goldMode: false },
  "neon-pink": { primaryHue: 330, secondaryHue: 290, goldMode: false },
  "solar-orange": { primaryHue: 25, secondaryHue: 45, goldMode: false },
}

const NeonContext = createContext<NeonContextType | null>(null)

const GLOW_LEVELS = {
  low: { sm: 0.2, md: 0.15, lg: 0.2 },
  medium: { sm: 0.4, md: 0.3, lg: 0.4 },
  high: { sm: 0.6, md: 0.5, lg: 0.6 },
}

export function NeonProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<NeonConfig>({
    primaryHue: 185,
    secondaryHue: 210,
    glowIntensity: "medium",
    goldMode: false,
    preset: "cyber-cyan",
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--neon-hue", String(config.primaryHue))
    root.style.setProperty("--neon-saturation", "100%")
    root.style.setProperty("--neon-lightness", "50%")
    root.style.setProperty("--neon2-hue", String(config.secondaryHue))
    root.style.setProperty("--neon2-saturation", "100%")
    root.style.setProperty("--neon2-lightness", "50%")

    const glow = GLOW_LEVELS[config.glowIntensity]
    root.style.setProperty("--neon-glow-sm", `0 0 5px hsl(var(--neon) / ${glow.sm})`)
    root.style.setProperty("--neon-glow-md", `0 0 15px hsl(var(--neon) / ${glow.md}), 0 0 30px hsl(var(--neon) / ${glow.md * 0.5})`)
    root.style.setProperty("--neon-glow-lg", `0 0 20px hsl(var(--neon) / ${glow.lg}), 0 0 40px hsl(var(--neon) / ${glow.lg * 0.5}), 0 0 80px hsl(var(--neon) / ${glow.lg * 0.25})`)

    if (config.goldMode) {
      root.classList.add("gold-mode")
    } else {
      root.classList.remove("gold-mode")
    }
  }, [config])

  const setConfig = (partial: Partial<NeonConfig>) => {
    setConfigState((prev) => ({ ...prev, ...partial }))
  }

  const applyPreset = (presetName: string) => {
    const p = PRESETS[presetName]
    if (p) {
      setConfigState((prev) => ({
        ...prev,
        primaryHue: p.primaryHue,
        secondaryHue: p.secondaryHue,
        goldMode: p.goldMode,
        preset: presetName,
      }))
    }
  }

  return (
    <NeonContext.Provider value={{ config, setConfig, applyPreset }}>
      {children}
    </NeonContext.Provider>
  )
}

export const THEME_PRESETS = PRESETS

export function useNeon() {
  const ctx = useContext(NeonContext)
  if (!ctx) throw new Error("useNeon must be used within NeonProvider")
  return ctx
}
