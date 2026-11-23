"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="relative px-5 py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-primary px-6 py-16 text-center text-primary-foreground shadow-float sm:px-12 sm:py-20"
      >
        <svg aria-hidden viewBox="0 0 400 300" className="pointer-events-none absolute inset-0 size-full opacity-[0.14]" preserveAspectRatio="xMidYMid slice">
          <circle cx="330" cy="70" r="46" className="animate-breathe" fill="currentColor" />
          <path d="M0 240 C 90 200, 200 230, 400 190 V300 H0Z" fill="currentColor" />
          <path d="M0 270 C 120 250, 260 268, 400 240 V300 H0Z" fill="currentColor" />
        </svg>

        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-heading text-4xl font-normal tracking-tight sm:text-6xl">
            Start with one conversation
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Sign up for free and say whatever&apos;s on your mind. No credit card
            needed.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-sm font-semibold text-primary transition-opacity duration-200 hover:opacity-90"
            >
              Start for free
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-foreground/10"
            >
              See the features
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
