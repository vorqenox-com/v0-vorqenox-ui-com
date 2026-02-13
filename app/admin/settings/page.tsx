"use client"

import { useStore } from "@/lib/store"
import { useNeon } from "@/lib/neon-context"
import { Save, Palette } from "lucide-react"
import { useState } from "react"

const NEON_PRESETS = [
  { name: "سماوي", hue: 185 },
  { name: "أخضر", hue: 145 },
  { name: "أزرق", hue: 210 },
  { name: "وردي", hue: 330 },
  { name: "برتقالي", hue: 25 },
  { name: "أحمر", hue: 0 },
]

export default function SettingsPage() {
  const { settings, setSettings } = useStore()
  const { config, setConfig } = useNeon()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setConfig({ hue: settings.neonHue })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>

      {/* Site Info */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">معلومات الموقع</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">اسم الموقع</label>
            <input
              value={settings.name}
              onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">الوصف</label>
            <textarea
              value={settings.description}
              onChange={(e) => setSettings((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Neon Color */}
      <div className="glass rounded-xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-neon" />
          <h2 className="text-lg font-semibold text-foreground">لون النيون</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {NEON_PRESETS.map((preset) => (
            <button
              key={preset.hue}
              onClick={() => {
                setSettings((prev) => ({ ...prev, neonHue: preset.hue }))
                setConfig({ hue: preset.hue })
              }}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
                settings.neonHue === preset.hue
                  ? "border-neon bg-neon/10 text-neon"
                  : "border-border text-muted-foreground hover:border-neon/30"
              }`}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: `hsl(${preset.hue}, 100%, 50%)` }}
              />
              {preset.name}
            </button>
          ))}
        </div>

        {/* Custom Hue Slider */}
        <div className="mt-4">
          <label className="mb-2 block text-xs text-muted-foreground">
            درجة اللون المخصصة: {settings.neonHue}
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={settings.neonHue}
            onChange={(e) => {
              const hue = Number(e.target.value)
              setSettings((prev) => ({ ...prev, neonHue: hue }))
              setConfig({ hue })
            }}
            className="w-full accent-neon"
          />
        </div>

        {/* Glow Intensity */}
        <div className="mt-4">
          <label className="mb-2 block text-xs text-muted-foreground">شدة التوهج</label>
          <div className="flex gap-3">
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setConfig({ glowIntensity: level })}
                className={`rounded-lg border px-4 py-2 text-xs transition-all ${
                  config.glowIntensity === level
                    ? "border-neon bg-neon/10 text-neon"
                    : "border-border text-muted-foreground hover:border-neon/30"
                }`}
              >
                {level === "low" ? "منخفض" : level === "medium" ? "متوسط" : "مرتفع"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pixel Tracking */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">أكواد التتبع (Pixel)</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Facebook Pixel</label>
            <input
              value={settings.facebookPixel}
              onChange={(e) => setSettings((prev) => ({ ...prev, facebookPixel: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
              placeholder="Facebook Pixel ID..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">TikTok Pixel</label>
            <input
              value={settings.tiktokPixel}
              onChange={(e) => setSettings((prev) => ({ ...prev, tiktokPixel: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
              placeholder="TikTok Pixel ID..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Snapchat Pixel</label>
            <input
              value={settings.snapPixel}
              onChange={(e) => setSettings((prev) => ({ ...prev, snapPixel: e.target.value }))}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
              placeholder="Snapchat Pixel ID..."
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="neon-ring flex items-center gap-2 rounded-lg bg-neon px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        style={{ boxShadow: "var(--neon-glow-sm)" }}
      >
        <Save className="h-4 w-4" />
        {saved ? "تم الحفظ!" : "حفظ الإعدادات"}
      </button>
    </div>
  )
}
