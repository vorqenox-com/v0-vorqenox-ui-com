"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="neon-text font-mono text-sm">{"جاري التحقق..."}</div>
      </div>
    )
  }

  return (
    <div dir="rtl" lang="ar" className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  )
}
