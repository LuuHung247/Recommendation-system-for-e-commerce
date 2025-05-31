"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, User, LogIn, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl" scroll={true}>
              <ShoppingBag className="h-6 w-6" />
              <span>Group15</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/items"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/items" ? "text-primary" : "text-muted-foreground"
                }`}
                scroll={true}
              >
                Shop
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/search")}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {user ? (
              <>
                <Link href="/profile" scroll={true}>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/login" scroll={true}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
