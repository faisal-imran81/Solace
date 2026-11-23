"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { GardenWindow } from "@/components/brand/Garden"

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-32 pb-20 sm:pt-40 lg:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 size-[28rem] rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-sage-soft opacity-70 blur-3xl dark:opacity-50" />
        <div className="absolute bottom-0 -left-32 size-[24rem] rounded-[60%_40%_45%_55%/55%_50%_50%_45%] bg-clay-soft opacity-60 blur-3xl dark:opacity-30" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span
            {...fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-sage" />
            24/7 emotional support
          </motion.span>

          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="mt-6 font-heading text-5xl leading-[1.05] font-normal tracking-tight text-balance text-foreground sm:text-6xl md:text-7xl"
          >
            A quiet place to{" "}
            <em className="font-normal text-sage-strong italic">be heard.</em>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
          >
            Talk through what&apos;s on your mind, write in a private journal and
            see how your mood shifts across the week. Only you can see what you write.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.24 }}
            className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Link
              href="/chat"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-colors duration-200 hover:bg-primary/90"
            >
              Start for free
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-card"
            >
              See how it works
            </a>
          </motion.div>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.32 }}
            className="mt-8 text-xs text-faint"
          >
            Free to use&ensp;·&ensp;No credit card&ensp;·&ensp;Private to your account
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-md"
        >
          <div aria-hidden className="absolute inset-x-6 -bottom-4 h-10 rounded-[50%] bg-foreground/10 blur-xl" />
          <GardenWindow className="relative drop-shadow-sm" />
        </motion.div>
      </div>
    </section>
  )
}
