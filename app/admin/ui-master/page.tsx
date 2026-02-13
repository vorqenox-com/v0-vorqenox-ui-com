"use client"

import { useStore } from "@/lib/store"
import { GripVertical, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react"

export default function UIMasterPage() {
  const { sectionOrder, setSectionOrder } = useStore()

  const toggleVisibility = (id: string) => {
    setSectionOrder((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    )
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setSectionOrder((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  const moveDown = (index: number) => {
    setSectionOrder((prev) => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">مدير الواجهة</h1>
      <p className="text-sm text-muted-foreground">
        قم بترتيب أقسام الصفحة الرئيسية وإظهارها أو إخفائها
      </p>

      <div className="glass rounded-xl p-4">
        <div className="space-y-2">
          {sectionOrder.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                section.visible
                  ? "border-neon/20 bg-neon/5"
                  : "border-border bg-card/50 opacity-50"
              }`}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />

              <span className="flex-1 text-sm font-medium text-foreground">
                {section.name}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(index)}
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
                  disabled={index === 0}
                >
                  <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="sr-only">Move up</span>
                </button>
                <button
                  onClick={() => moveDown(index)}
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
                  disabled={index === sectionOrder.length - 1}
                >
                  <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="sr-only">Move down</span>
                </button>
                <button
                  onClick={() => toggleVisibility(section.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
                >
                  {section.visible ? (
                    <Eye className="h-3.5 w-3.5 text-neon" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle visibility</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
