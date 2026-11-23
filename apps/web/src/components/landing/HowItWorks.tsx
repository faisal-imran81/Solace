"use client"

import { motion } from "framer-motion"
import { UserPlus, MessageCircle, Sprout, type LucideIcon } from "lucide-react"
import { SectionLabel } from "./SectionLabel"

const steps: {
  icon: LucideIcon
  number: string
  title: string
  description: string
}[] = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create an account",
    description:
      "Sign up for free. It takes about a minute.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Talk to Solace",
    description:
      "Start a chat, log your mood or write a journal entry. Begin with whatever you need today.",
  },
  {
    icon: Sprout,
    number: "03",
    title: "See your week",
    description:
      "Your dashboard brings it together: a wellness score, your mood over the last seven days, and your recent chats and entries.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 bg-card/60 px-5 py-24 sm:py-28">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-border" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-4 font-heading text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
            Getting started is quick
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Sign up, pick a place to start, and come back whenever you need to.
          </p>
        </motion.div>

        <div className="relative mt-20">
          <svg
            aria-hidden
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="absolute top-7 right-[16%] left-[16%] hidden h-10 w-[68%] lg:block"
          >
            <path
              d="M0 20 C 120 0, 240 40, 360 20 S 600 0, 720 20 S 900 40, 1000 20"
              className="stroke-line-strong"
              strokeWidth="1.5"
              strokeDasharray="2 8"
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid gap-14 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 grid size-16 place-items-center rounded-[45%_55%_50%_50%/55%_45%_55%_45%] border border-border bg-background shadow-soft">
                  <step.icon className="size-6 text-sage-strong" strokeWidth={1.75} />
                </div>

                <span className="mt-6 font-heading text-5xl leading-none font-light text-clay italic">
                  {step.number}
                </span>

                <h3 className="mt-4 font-heading text-2xl font-medium text-foreground">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
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
