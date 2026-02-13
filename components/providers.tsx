"use client"

import { NeonProvider } from "@/lib/neon-context"
import { AuthProvider } from "@/lib/auth-context"
import { StoreProvider } from "@/lib/store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NeonProvider>
      <AuthProvider>
        <StoreProvider>{children}</StoreProvider>
      </AuthProvider>
    </NeonProvider>
  )
}
