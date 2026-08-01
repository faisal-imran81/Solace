"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { MessageSquare, BarChart3, PenLine, LayoutDashboard } from "lucide-react"

export function MobileNav() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()

  if (!isSignedIn) return null

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-cyan-400" },
    { href: "/chat", label: "Chat", icon: MessageSquare, color: "text-violet-400" },
    { href: "/mood", label: "Mood", icon: BarChart3, color: "text-fuchsia-400" },
    { href: "/journal", label: "Journal", icon: PenLine, color: "text-violet-400" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex sm:hidden items-center justify-around border-t border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl px-2 py-2">
      {items.map(({ href, label, icon: Icon, color }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive ? "bg-white/[0.06] " + color : "text-white/50 hover:text-white"
            }`}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
