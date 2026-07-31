"use client"

import { Brain } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { UserButton, useUser } from "@clerk/nextjs"

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Testimonials" },
]

export function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 pr-2.5 pl-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <a href="#" className="flex items-center gap-2.5 text-base font-semibold text-white">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30">
            <Brain className="size-5" />
          </span>
          Solace
        </a>

        <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/chat"
                className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-transform duration-200 hover:scale-105"
              >
                Go to Chat
              </Link>
              <UserButton />
            </>
          ) : (
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-transform duration-200 hover:scale-105"
            >
              Get Started
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
