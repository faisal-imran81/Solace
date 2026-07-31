"use client"

import { motion } from "framer-motion"
import { UserPlus, MessageCircle, TrendingUp, type LucideIcon } from "lucide-react"

const steps: {
  icon: LucideIcon
  number: string
  title: string
  description: string
}[] = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Account",
    description:
      "Sign up anonymously in seconds. No personal information required.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Talk to Solace",
    description:
      "Start a conversation, track your mood, or write in your journal.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Grow & Heal",
    description:
      "Get personalized insights and watch your wellness improve over time.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 px-4 py-28">
      <div className="pointer-events-none absolute top-1/4 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
            How it works
          </span>
          <h2 className="mt-4 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
            How Solace Works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Three simple steps. Your entire journey — private and pressure-free.
          </p>
        </motion.div>

        <div className="relative mt-20">
          <div className="absolute top-8 right-[16%] left-[16%] hidden border-t-2 border-dashed border-white/15 lg:block" />

          <div className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 grid size-16 place-items-center rounded-2xl border border-white/10 bg-[#0d0d15] shadow-lg shadow-violet-500/10">
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-violet-600/20 blur-xl" />
                  <step.icon className="size-7 text-cyan-400" />
                </div>

                <span className="mt-6 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-6xl font-black leading-none text-transparent">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
