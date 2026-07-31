"use client"

import { motion } from "framer-motion"
import { ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { Reveal } from "./Reveal"

export function CTA() {
  return (
    <section className="relative px-4 py-28">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 px-8 py-20 text-center sm:py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(500px_at_50%_120%,rgba(255,255,255,0.25),transparent_70%)]" />

          <motion.div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-white/20 blur-[80px]"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
              <Heart className="size-3.5" /> Free forever for individuals
            </span>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Your mental health matters.
              <br className="hidden sm:block" /> Start today — it&rsquo;s free.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80">
              Join millions who found a little more peace, one conversation at a
              time.
            </p>

            <Link
              href="/sign-up"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-violet-700 shadow-2xl shadow-black/20 transition-all duration-200 hover:scale-[1.03]"
            >
              Get Started
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
