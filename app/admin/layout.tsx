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
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: "#050505" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(34, 211, 238, 0.08)",
              boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)",
            }}
          >
            <Shield className="h-7 w-7 animate-pulse text-cyan-400" />
          </div>
          <p className="font-mono text-sm tracking-widest text-cyan-400">
            VERIFYING ACCESS...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen max-w-full overflow-hidden" style={{ background: "#050505" }}>
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="w-full px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
