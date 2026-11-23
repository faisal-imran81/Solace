"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useInView } from "framer-motion"

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [display, setDisplay] = useState(0)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 2, bounce: 0 })

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(Math.round(v)))
    return unsubscribe
  }, [spring])

  return (
    <span ref={ref}>
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  )
}

const stats = [
  { value: 24, suffix: "/7", label: "Chat whenever you need to" },
  { value: 5, suffix: "", label: "Moods to choose from" },
  { value: 7, suffix: "-day", label: "Mood chart on your dashboard" },
  { value: 4, suffix: "", label: "Rounds of guided 4-7-8 breathing" },
]

export function Impact() {
  return (
    <section className="relative px-5 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-sage-soft px-6 py-14 sm:px-10 sm:py-16"
      >
        <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-16 -bottom-20 w-72 text-sage/25">
          <path fill="currentColor" d="M30 170C30 90 80 34 170 30c0 92-52 140-140 140Z" />
        </svg>
        <div className="relative grid grid-cols-2 gap-x-6 gap-y-12 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-5xl font-light tracking-tight text-primary sm:text-6xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mx-auto mt-3 max-w-[12rem] text-sm text-secondary-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
