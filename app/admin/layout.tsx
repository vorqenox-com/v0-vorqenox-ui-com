"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Shield } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin-gateway")
    } else {
      setChecked(true)
    }
  }, [isAuthenticated, router])

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#050505" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              background: "hsl(var(--neon) / 0.08)",
              boxShadow: "0 0 20px hsl(var(--neon) / 0.2)",
            }}
          >
            <Shield className="h-7 w-7 animate-pulse" style={{ color: "hsl(var(--neon))" }} />
          </div>
          <p
            className="font-mono text-sm tracking-widest"
            style={{ color: "hsl(var(--neon))" }}
          >
            VERIFYING ACCESS...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#050505" }}>
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
