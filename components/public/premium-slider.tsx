"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Crown, Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function PremiumSlider() {
  const { articles } = useStore()
  const premiumArticles = articles.filter((a) => a.cardType === "premium")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (premiumArticles.length === 0) return null

  return (
    <section id="premium">
      <div className="mb-6 flex items-center gap-2.5">
        <Crown className="h-5 w-5 text-yellow-400" />
        <h2 className="text-lg font-semibold text-white">Premium Collection</h2>
        <Sparkles className="h-4 w-4 text-cyan-400" />
      </div>

      {/* 3D Perspective Stack Container */}
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ perspective: "1000px" }}
      >
        {premiumArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, rotateX: 8, y: 30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.12,
              ease: "easeOut",
            }}
            whileHover={{
              rotateY: -4,
              rotateX: 3,
              scale: 1.03,
              z: 40,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Link href={`/article/${article.id}`} className="block h-full">
              <div
                className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-300"
                style={{
                  boxShadow:
                    hoveredIndex === index
                      ? "0 0 25px rgba(34, 211, 238, 0.15), 0 20px 60px rgba(0,0,0,0.4)"
                      : "0 4px 30px rgba(0,0,0,0.2)",
                  borderColor:
                    hoveredIndex === index
                      ? "rgba(34, 211, 238, 0.25)"
                      : "rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Card Image Area */}
                <div
                  className="relative flex h-44 items-center justify-center overflow-hidden sm:h-52"
                  style={{
                    background: `linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)`,
                  }}
                >
                  {/* Floating neon accent */}
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity duration-300"
                    style={{
                      background: "radial-gradient(circle, rgba(34, 211, 238, 0.4), transparent)",
                      opacity: hoveredIndex === index ? 0.5 : 0.2,
                    }}
                  />
                  <span className="relative z-10 px-6 text-center font-mono text-sm font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                    {article.title}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-yellow-400/80">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-semibold leading-snug text-gray-200">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {article.excerpt}
                  </p>

                  {/* Premium indicator bar */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-[2px] flex-1 rounded-full bg-gradient-to-r from-cyan-500/30 to-transparent" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-500/50">
                      Premium
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
