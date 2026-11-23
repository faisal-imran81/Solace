"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { UserButton, useUser } from "@clerk/nextjs"
import { Logo } from "@/components/brand/Logo"

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Testimonials" },
]

export function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-full border border-border bg-card/85 py-2 pr-2 pl-4 shadow-soft backdrop-blur-md">
        <a href="#" aria-label="Solace home" className="rounded-full">
          <Logo markClassName="size-8" />
        </a>

        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-line-strong sm:inline-flex"
              >
                Dashboard
              </Link>
              <Link
                href="/chat"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                Open chat
              </Link>
              <UserButton />
            </>
          ) : (
            <Link
              href="/sign-up"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Get started
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
