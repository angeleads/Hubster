import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { SessionMonitor } from "@/components/utils/session-monitor"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Hubster",
  description: "EPITECH's HUB tool for students",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SessionMonitor />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
