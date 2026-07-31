"use client"

import { Brain } from "lucide-react"

const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
  { label: "GitHub", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0f] px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        <span className="flex items-center gap-2 text-base font-semibold text-white/40 transition-colors duration-200 hover:text-white/80">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
            <Brain className="size-4 text-white" />
          </span>
          Solace
        </span>

        <div className="flex items-center gap-8 text-sm text-white/40">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-white/80"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-white/40">
        © 2025 Solace. Built with ❤️ for mental health accessibility.
      </p>
    </footer>
  )
}
