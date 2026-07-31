"use client"

import { useRef, useState, useEffect } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { ArrowRight, Play, Sparkles, Brain, Send, Heart } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const BrainOrb = dynamic(() => import("@/components/three/BrainOrb"), { ssr: false })

const phrases = ["Find Your Peace", "Heal Your Mind", "You Are Not Alone"]

function CyclingHeadline() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="relative block h-[1.2em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Particles() {
  const particles = [
    { top: "18%", left: "12%", size: 4, delay: 0 },
    { top: "28%", left: "82%", size: 3, delay: 0.6 },
    { top: "62%", left: "8%", size: 5, delay: 1.2 },
    { top: "70%", left: "90%", size: 3, delay: 0.3 },
    { top: "45%", left: "94%", size: 4, delay: 0.9 },
    { top: "80%", left: "45%", size: 3, delay: 1.5 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-cyan-300/60 blur-[1px]"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

function MockChat() {
  const bubbles = [
    { from: "ai", text: "Hey, I'm here for you. How are you feeling today?" },
    { from: "user", text: "A little overwhelmed, honestly." },
    { from: "ai", text: "That's completely valid. Want to talk through it together?" },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
          <Brain className="size-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-white">Solace AI</p>
          <p className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" /> online now
          </p>
        </div>
      </div>

      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.4 }}
          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
            b.from === "ai"
              ? "self-start rounded-tl-sm border border-white/10 bg-white/[0.06] text-white/90"
              : "self-end rounded-tr-sm bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
          }`}
        >
          {b.text}
        </motion.div>
      ))}

      <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <span className="flex-1 text-[11px] text-white/40">Type a message...</span>
        <span className="grid size-6 place-items-center rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500">
          <Send className="size-3" />
        </span>
      </div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const cardX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), {
    stiffness: 120,
    damping: 20,
  })
  const cardY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 20,
  })
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["30%", "70%"])
  const glowBackground = useTransform(
    glowX,
    (x) =>
      `radial-gradient(400px at ${x} 40%, rgba(139,92,246,0.35), rgba(6,182,212,0.25), transparent)`
  )

  function handleMouseMove(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-24 pt-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />

      <motion.div
        className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-violet-600/25 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-40 -bottom-40 size-[32rem] rounded-full bg-cyan-500/20 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -60, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/3 right-1/4 size-72 rounded-full bg-fuchsia-600/20 blur-[100px]"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <Particles />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md"
          >
            <Sparkles className="size-3.5 text-cyan-400" />
            AI-powered emotional support, 24/7
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            <CyclingHeadline />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0"
          >
            AI-powered emotional support, available 24/7, for every human on
            earth. Talk, journal, and grow — completely anonymous.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              href="/chat"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-violet-500/50"
            >
              Start for Free
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
            >
              <Play className="size-4" />
              Watch Demo
            </a>
          </motion.div>
        </div>

          <motion.div
            style={{ x: cardX, y: cardY, perspective: 800 }}
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="relative aspect-square w-full">
              <motion.div
                className="absolute inset-0 -z-10 rounded-3xl blur-3xl"
                style={{ background: glowBackground }}
              />
              <div className="h-full w-full overflow-hidden rounded-3xl">
                <BrainOrb />
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-xs font-medium text-white/80">
                  <span className="size-2 rounded-full bg-violet-400" />
                  Your safe space
                </span>
                <span className="flex items-center gap-2 text-xs text-white/50">
                  <Heart className="size-3.5 text-rose-400" /> 24/7
                </span>
              </div>
              <MockChat />
            </div>
          </motion.div>
      </div>
    </section>
  )
}
