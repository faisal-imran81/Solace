"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials: {
  quote: string
  initials: string
  gradient: string
  name: string
  tag: string
}[] = [
  {
    quote: "Solace helped me through my worst anxiety attack at 3am. I didn't feel alone.",
    initials: "MK",
    gradient: "from-violet-500 to-fuchsia-500",
    name: "M.K.",
    tag: "Using Solace for 2 months",
  },
  {
    quote:
      "The mood tracker showed me patterns I never noticed. My therapist was impressed.",
    initials: "AR",
    gradient: "from-cyan-500 to-sky-500",
    name: "A.R.",
    tag: "Using Solace for 6 weeks",
  },
  {
    quote:
      "Finally a place I could write without fear of judgment. The AI reflections are surprisingly deep.",
    initials: "ST",
    gradient: "from-fuchsia-500 to-cyan-500",
    name: "S.T.",
    tag: "Using Solace for 1 month",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative scroll-mt-24 px-4 py-28">
      <div className="pointer-events-none absolute top-1/3 left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
            Testimonials
          </span>
          <h2 className="mt-4 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
            Real People, Real Healing
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Real humans, real healing — from every corner of the planet.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="mt-5 flex-1 text-sm leading-relaxed text-white/80 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.tag}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
