import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { AuthProvider } from "@/components/auth-provider"
import ScrollToTopProvider from "@/components/scroll-to-top-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Group15 - Modern E-commerce",
  description: "A modern e-commerce platform built with Next.js",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ScrollToTopProvider>
            <Header />
            <main className="min-h-screen pt-16">{children}</main>
            <Toaster />
          </ScrollToTopProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
