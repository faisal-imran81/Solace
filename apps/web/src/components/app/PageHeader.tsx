"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { LogoMark } from "@/components/brand/Logo"
import { cn } from "@/lib/utils"

const WIDTHS = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const

export const APP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Chat" },
  { href: "/mood", label: "Mood" },
  { href: "/journal", label: "Journal" },
]

export function AppLinks() {
  const pathname = usePathname()
  return (
    <nav aria-label="App" className="hidden items-center gap-1 rounded-full border border-border bg-card/70 p-1 md:flex">
      {APP_LINKS.map((l) => {
        const active = pathname === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
              active
                ? "bg-sage-soft font-medium text-sage-strong"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function PageHeader({
  title,
  subtitle,
  width = "6xl",
  children,
}: {
  title: string
  subtitle?: string
  width?: keyof typeof WIDTHS
  children?: ReactNode
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className={cn("mx-auto flex w-full items-center justify-between gap-3 px-4 py-3", WIDTHS[width])}>
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-line-strong hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <LogoMark className="hidden size-8 sm:block" />
          <div className="min-w-0 leading-tight">
            <h1 className="truncate font-heading text-xl font-medium text-foreground">{title}</h1>
            {subtitle && <p className="truncate text-xs text-faint">{subtitle}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <AppLinks />
          {children}
        </div>
      </div>
    </header>
  )
}
