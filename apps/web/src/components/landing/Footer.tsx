"use client"

import { Logo } from "@/components/brand/Logo"

const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
  { label: "GitHub", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        <Logo markClassName="size-8" />

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-faint">
        © 2025 Solace. Built with ❤️ to make mental health support easier to reach.
      </p>
    </footer>
  )
}
