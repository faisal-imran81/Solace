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
  { value: 50000, suffix: "+", label: "Users Supported" },
  { value: 2, suffix: "M+", label: "Conversations" },
  { value: 98, suffix: "%", label: "Feel Less Alone" },
  { value: 24, suffix: "/7", label: "Always Available" },
]

export function Impact() {
  return (
    <section className="relative px-4 py-28">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-16 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 gap-12 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
