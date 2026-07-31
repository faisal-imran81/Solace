"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Reveal, staggerContainer, fadeUp } from "./Reveal"

const testimonials = [
  {
    name: "Sarah Mitchell",
    country: "USA",
    flag: "🇺🇸",
    initials: "SM",
    gradient: "from-violet-500 to-fuchsia-500",
    review:
      "Solace became my late-night safe space. When my anxiety spikes at 2am, someone is always there to help me breathe through it. I've never felt this understood.",
  },
  {
    name: "Arjun Mehta",
    country: "India",
    flag: "🇮🇳",
    initials: "AM",
    gradient: "from-cyan-500 to-sky-500",
    review:
      "The mood tracker showed me patterns I never noticed on my own. I finally understand what drains me and what lifts me up. It's genuinely changed how I live.",
  },
  {
    name: "Lucas Ferreira",
    country: "Brazil",
    flag: "🇧🇷",
    initials: "LF",
    gradient: "from-fuchsia-500 to-cyan-500",
    review:
      "Journaling here feels different — private, safe, and mine. The AI companion talks like a real friend, not a robot. Thank you, Solace.",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative scroll-mt-24 px-4 py-28">
      <div className="pointer-events-none absolute top-1/3 left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Loved around the world
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Real humans, real healing — from every corner of the planet.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="mt-5 flex-1 text-sm leading-relaxed text-white/70">
                &ldquo;{t.review}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/50">
                    {t.flag} {t.country}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
