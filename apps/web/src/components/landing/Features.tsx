"use client"

import { motion } from "framer-motion"
import { Brain, BarChart3, BookOpen } from "lucide-react"
import { Reveal, staggerContainer, fadeUp } from "./Reveal"

const features = [
  {
    icon: Brain,
    title: "AI Chat Companion",
    description:
      "A judgment-free AI companion that listens, understands, and supports you through anything — any time of day or night.",
    accent: "from-violet-500 to-fuchsia-500",
    glow: "group-hover:shadow-violet-500/30",
  },
  {
    icon: BarChart3,
    title: "Mood Tracker",
    description:
      "Log how you feel and uncover patterns over time with beautiful, insight-rich charts that help you understand yourself.",
    accent: "from-cyan-500 to-sky-500",
    glow: "group-hover:shadow-cyan-500/30",
  },
  {
    icon: BookOpen,
    title: "Private Journal",
    description:
      "A secure, end-to-end encrypted space to pour your thoughts. Write freely — it's yours and yours alone.",
    accent: "from-fuchsia-500 to-cyan-500",
    glow: "group-hover:shadow-fuchsia-500/30",
  },
]

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 px-4 py-28">
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Everything you need to heal
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            One calm, private place for your mind — powered by AI that meets you
            where you are.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(300px_at_50%_0%,rgba(139,92,246,0.15),transparent_70%)]" />
              </div>

              <div
                className={`relative inline-grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${feature.accent} shadow-lg ${feature.glow} transition-shadow duration-300`}
              >
                <feature.icon className="size-7 text-white" />
              </div>

              <h3 className="relative mt-6 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                {feature.description}
              </p>

              <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
