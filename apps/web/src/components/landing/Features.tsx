"use client"

import { motion } from "framer-motion"
import {
  Brain,
  BarChart2,
  BookOpen,
  Shield,
  Zap,
  Globe,
  type LucideIcon,
} from "lucide-react"

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Brain,
    title: "AI Therapy Sessions",
    description:
      "Talk to Solace anytime. Empathetic, judgment-free conversations powered by advanced AI.",
  },
  {
    icon: BarChart2,
    title: "Mood Analytics",
    description:
      "Track your emotional patterns with beautiful visualizations and weekly insights.",
  },
  {
    icon: BookOpen,
    title: "Private Journal",
    description:
      "Write freely. AI analyzes sentiment and offers gentle reflections.",
  },
  {
    icon: Shield,
    title: "100% Anonymous",
    description: "No names, no judgments. Your privacy is sacred and fully protected.",
  },
  {
    icon: Zap,
    title: "Instant Support",
    description:
      "Crisis? Get immediate coping strategies and helpline connections.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Connect anonymously with others who understand what you're going through.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 px-4 py-28">
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
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
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(300px_at_50%_0%,rgba(139,92,246,0.15),transparent_70%)]" />
              </div>

              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2 }}
                className="relative inline-grid size-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25"
              >
                <feature.icon className="size-6 text-white" />
              </motion.div>

              <h3 className="relative mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
