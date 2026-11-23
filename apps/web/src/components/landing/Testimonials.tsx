"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { SectionLabel } from "./SectionLabel"

const testimonials: {
  quote: string
  initials: string
  tone: string
  name: string
  tag: string
}[] = [
  {
    quote: "Solace helped me through my worst anxiety attack at 3am. I didn't feel alone.",
    initials: "MK",
    tone: "bg-sage-soft text-sage-strong",
    name: "M.K.",
    tag: "Using Solace for 2 months",
  },
  {
    quote:
      "The mood tracker showed me patterns I never noticed. My therapist was impressed.",
    initials: "AR",
    tone: "bg-clay-soft text-clay-strong",
    name: "A.R.",
    tag: "Using Solace for 6 weeks",
  },
  {
    quote:
      "Finally a place I could write without fear of judgment. The AI reflections are surprisingly deep.",
    initials: "ST",
    tone: "bg-secondary text-secondary-foreground",
    name: "S.T.",
    tag: "Using Solace for 1 month",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative scroll-mt-24 px-5 py-24 sm:py-28">
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="mt-4 font-heading text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
            What people have told us
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A few notes from people who use Solace.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="surface leaf-corner relative flex flex-col p-7"
            >
              <span aria-hidden className="absolute top-3 right-6 font-heading text-7xl leading-none text-clay/40">
                &ldquo;
              </span>
              <div className="flex gap-1" aria-label="5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-clay text-clay" />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 font-heading text-lg leading-relaxed text-foreground">
                {t.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${t.tone}`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-faint">{t.tag}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
