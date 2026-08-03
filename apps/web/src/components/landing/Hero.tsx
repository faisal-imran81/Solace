"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <motion.div
        className="absolute -top-28 -left-28 size-[28rem] rounded-full bg-violet-600/25 blur-[130px]"
        animate={{ x: [0, 50, 0], y: [0, 35, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 -bottom-32 size-[30rem] rounded-full bg-cyan-500/20 blur-[130px]"
        animate={{ x: [0, -45, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 left-1/2 size-80 -translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-[110px]"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

function Particles() {
  const particles = [
    { top: "16%", left: "12%", size: 2, delay: 0, color: "bg-cyan-300/50" },
    { top: "24%", left: "84%", size: 2, delay: 0.8, color: "bg-violet-300/50" },
    { top: "58%", left: "8%", size: 3, delay: 1.4, color: "bg-cyan-300/40" },
    { top: "66%", left: "90%", size: 2, delay: 0.4, color: "bg-fuchsia-300/40" },
    { top: "42%", left: "94%", size: 3, delay: 2, color: "bg-violet-300/40" },
    { top: "76%", left: "40%", size: 2, delay: 1.1, color: "bg-cyan-300/40" },
    { top: "12%", left: "50%", size: 2, delay: 1.7, color: "bg-white/30" },
    { top: "82%", left: "20%", size: 2, delay: 2.3, color: "bg-white/25" },
  ]

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full blur-[1px] ${p.color}`}
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{ y: [-10, 10, -10], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-36 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_72%)]"
      />
      <Aurora />
      <Particles />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.04, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="size-full rounded-full bg-violet-500/10 blur-[100px]" />
      </motion.div>

      <div className="relative flex w-full max-w-3xl flex-col items-center text-center">
        <motion.span
          {...fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-white/60 uppercase backdrop-blur-md"
        >
          <Sparkles className="size-3.5 text-cyan-300" />
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
          24/7 emotional support
        </motion.span>

        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="mt-6 text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl md:text-6xl"
        >
          A quiet place to{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            be heard.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.16 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/60 sm:text-lg"
        >
          Talk through what&apos;s on your mind, journal freely, and understand
          your moods — completely anonymous, in a space built to let you breathe.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.24 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/chat"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-[filter,box-shadow] duration-200 hover:shadow-violet-500/40 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Start for free
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-md transition-colors duration-200 hover:border-white/35 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.32 }}
          className="mt-8 text-xs text-white/40"
        >
          Free forever&ensp;·&ensp;No credit card&ensp;·&ensp;100% anonymous
        </motion.p>
      </div>
    </section>
  )
}
