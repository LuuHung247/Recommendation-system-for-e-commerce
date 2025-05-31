"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function ScrollToTopProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top when the route changes with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [pathname])

  return <>{children}</>
}
