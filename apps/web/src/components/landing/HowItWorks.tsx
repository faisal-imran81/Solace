"use client"

import { motion } from "framer-motion"
import { UserPlus, MessagesSquare, TrendingUp } from "lucide-react"
import { Reveal, staggerContainer, fadeUp } from "./Reveal"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign up anonymously",
    description:
      "Create an account with just a username. No personal details, no phone number, no judgment.",
  },
  {
    icon: MessagesSquare,
    step: "02",
    title: "Talk to your AI companion",
    description:
      "Open up to an empathetic AI that listens deeply and responds with care, around the clock.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Track your growth",
    description:
      "Watch your mood, resilience, and self-awareness grow with patterns you can see clearly.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            From overwhelmed to understood
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Three simple steps. Your entire journey — private and pressure-free.
          </p>
        </Reveal>

        <div className="relative mt-20">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-6 right-[16%] left-[16%] hidden h-px origin-left bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-cyan-500/50 lg:block"
          />

          <motion.div
            variants={staggerContainer(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="relative grid gap-12 lg:grid-cols-3 lg:gap-8"
          >
            {steps.map((step) => (
              <motion.div key={step.step} variants={fadeUp} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 grid size-12 place-items-center rounded-2xl border border-white/10 bg-[#0d0d15] shadow-lg shadow-black/40">
                  <step.icon className="size-5 text-cyan-400" />
                </div>

                <div className="mt-6 inline-flex items-baseline gap-2">
                  <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-sm font-bold text-transparent">
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
