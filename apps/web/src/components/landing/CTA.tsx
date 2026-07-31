"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="relative overflow-hidden px-4 py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/50 via-transparent to-cyan-900/30" />

      <div className="pointer-events-none absolute -top-32 -left-32 size-[28rem] rounded-full bg-violet-600/20 blur-[120px]">
        <motion.div
          className="size-full rounded-full"
          animate={{ x: [0, 50, 0], y: [0, 35, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="pointer-events-none absolute -right-40 -bottom-40 size-[30rem] rounded-full bg-cyan-500/15 blur-[120px]">
        <motion.div
          className="size-full rounded-full"
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            Your healing journey starts today
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Join thousands finding peace with Solace. Free forever, no credit card
            needed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-violet-500/50"
            >
              Start for Free
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
