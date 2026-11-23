"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { MessageCircle, SmilePlus, NotebookPen, LayoutDashboard } from "lucide-react"

export function MobileNav() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()

  if (!isSignedIn) return null

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/mood", label: "Mood", icon: SmilePlus },
    { href: "/journal", label: "Journal", icon: NotebookPen },
  ]

  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-background/90 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-colors duration-200 ${
              isActive ? "bg-sage-soft text-sage-strong" : "text-faint hover:text-foreground"
            }`}
          >
            <Icon className="size-5" strokeWidth={1.75} />
            <span className="text-[11px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
