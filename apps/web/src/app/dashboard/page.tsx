"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  PenLine,
  Plus,
  MessageCircle,
  BarChart3,
  Smile,
  RefreshCw,
  Pin,
} from "lucide-react"

type MoodEntry = {
  id: string
  mood: number
  note: string | null
  createdAt: string
}

type Journal = {
  id: string
  title: string
  content: string
  pinned: boolean
  sentiment: string | null
  createdAt: string
  updatedAt: string
}

type Session = {
  id: string
  title: string | null
  pinned: boolean
  createdAt: string
  updatedAt: string
}

const MOODS = [
  { value: 1, emoji: "😔", label: "Very Bad" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Amazing" },
]

const BAR_HEIGHTS: Record<number, string> = {
  1: "20%",
  2: "40%",
  3: "60%",
  4: "80%",
  5: "100%",
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const SENTIMENT_BADGE: Record<string, { label: string; className: string }> = {
  positive: { label: "😊 Positive", className: "bg-emerald-500/20 text-emerald-400" },
  negative: { label: "😔 Difficult", className: "bg-rose-500/20 text-rose-400" },
  neutral: { label: "😐 Neutral", className: "bg-blue-500/20 text-blue-400" },
}

const PARTICLES = [
  { top: "14%", left: "8%", size: 5, delay: 0, color: "rgba(34,211,238,0.7)" },
  { top: "28%", left: "88%", size: 4, delay: 0.6, color: "rgba(217,70,239,0.6)" },
  { top: "58%", left: "5%", size: 6, delay: 1.2, color: "rgba(139,92,246,0.7)" },
  { top: "72%", left: "92%", size: 3, delay: 0.3, color: "rgba(34,211,238,0.6)" },
  { top: "44%", left: "95%", size: 4, delay: 0.9, color: "rgba(139,92,246,0.6)" },
]

type QuickAction = {
  icon: ReactNode
  label: string
  href: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: <MessageCircle className="size-5 text-cyan-400" />, label: "New Chat", href: "/chat" },
  { icon: <PenLine className="size-5 text-violet-400" />, label: "New Journal", href: "/journal" },
  { icon: <Smile className="size-5 text-fuchsia-400" />, label: "Log Mood", href: "/mood" },
  { icon: <BarChart3 className="size-5 text-emerald-400" />, label: "View Stats", href: "#mood-chart" },
]

function getLast7Days() {
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    days.push(d)
  }
  return days
}

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return "Good Morning ☀️"
  if (h >= 12 && h < 17) return "Good Afternoon 🌤️"
  if (h >= 17 && h < 21) return "Good Evening 🌅"
  return "Good Night 🌙"
}

function calcWellnessScore(
  moodEntries: MoodEntry[],
  journals: Journal[],
  sessions: Session[],
): number {
  let score = 50 // base

  // Mood contribution (up to 30 pts)
  if (moodEntries.length > 0) {
    const avgMood =
      moodEntries.reduce((s, e) => s + e.mood, 0) / moodEntries.length
    score += ((avgMood - 1) / 4) * 30
  }

  // Journal contribution (up to 10 pts)
  score += Math.min(journals.length * 2, 10)

  // Chat contribution (up to 10 pts)
  score += Math.min(sessions.length * 2, 10)

  return Math.min(100, Math.round(score))
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

type BreathingPhase = "idle" | "inhale" | "hold" | "exhale"

export default function DashboardPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [journals, setJournals] = useState<Journal[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [affirmation, setAffirmation] = useState<string | null>(null)
  const [affirmationLoading, setAffirmationLoading] = useState(true)

  // Breathing state
  const [phase, setPhase] = useState<BreathingPhase>("idle")
  const [countdown, setCountdown] = useState(4)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [moodRes, journalRes, sessionRes] = await Promise.all([
          fetch("/api/mood"),
          fetch("/api/journal"),
          fetch("/api/chat/session"),
        ])
        if (!mounted) return
        if (moodRes.ok) {
          const data = await moodRes.json()
          setMoodEntries(data.entries ?? [])
        }
        if (journalRes.ok) {
          const data = await journalRes.json()
          setJournals(Array.isArray(data) ? data : data.journals ?? [])
        }
        if (sessionRes.ok) {
          const data = await sessionRes.json()
          setSessions(Array.isArray(data) ? data : data.sessions ?? [])
        }
      } catch {
        /* silent */
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  async function fetchAffirmation() {
    setAffirmationLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/journal/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content:
            "Generate a short, powerful daily affirmation for mental wellness. Make it uplifting and personal. Max 2 sentences.",
        }),
      })
      const data = await res.json()
      setAffirmation(data.reflection)
    } catch {
      setAffirmation(
        "You are stronger than you think. Every day is a new beginning. 💜",
      )
    } finally {
      setAffirmationLoading(false)
    }
  }

  useEffect(() => {
    fetchAffirmation()
  }, [])

  // Breathing cycle timers
  useEffect(() => {
    if (phase === "idle") return
    if (countdown <= 0) {
      if (phase === "inhale") {
        setPhase("hold")
        setCountdown(7)
      } else if (phase === "hold") {
        setPhase("exhale")
        setCountdown(8)
      } else {
        if (cycle + 1 >= 4) {
          setPhase("idle")
          setCountdown(4)
          setCycle(0)
        } else {
          setCycle((c) => c + 1)
          setPhase("inhale")
          setCountdown(4)
        }
      }
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown, cycle])

  const score = useMemo(
    () => calcWellnessScore(moodEntries, journals, sessions),
    [moodEntries, journals, sessions],
  )
  const animatedScore = useCountUp(score)

  const scoreColor =
    score < 40 ? "#f43f5e" : score <= 70 ? "#f59e0b" : "#10b981"

  const avgMood =
    moodEntries.length > 0
      ? moodEntries.reduce((s, e) => s + e.mood, 0) / moodEntries.length
      : 0
  const avgMoodInfo = MOODS.find((m) => m.value === Math.round(avgMood)) ?? MOODS[2]

  const days = getLast7Days()

  function entryForDay(day: Date) {
    return moodEntries.find((e) => {
      const c = new Date(e.createdAt)
      return (
        c.getFullYear() === day.getFullYear() &&
        c.getMonth() === day.getMonth() &&
        c.getDate() === day.getDate()
      )
    })
  }

  const RING_RADIUS = 52
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

  // Breathing circle animation params
  const breathingScale = phase === "exhale" ? 1 : 1.4
  const breathingDuration =
    phase === "inhale" ? 4 : phase === "hold" ? 7 : phase === "exhale" ? 8 : 4
  const phaseLabel =
    phase === "idle"
      ? "Ready"
      : phase === "inhale"
        ? "Breathe In"
        : phase === "hold"
          ? "Hold"
          : "Breathe Out"

  function stopBreathing() {
    setPhase("idle")
    setCountdown(4)
    setCycle(0)
  }

  function renderSkeleton() {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/[0.06]" />
        ))}
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0d0d0d] text-white">
      <style>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(-8px); opacity: 0.25; }
          50% { transform: translateY(8px); opacity: 1; }
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.08); }
          66% { transform: translate(-30px, -20px) scale(0.95); }
        }
        .solace-particle { animation: particleFloat 5s ease-in-out infinite; }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div
        className="pointer-events-none fixed -top-64 -left-64 z-0 size-[600px] rounded-full bg-violet-600/25 blur-[120px]"
        style={{ animation: "blobDrift 16s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none fixed -right-40 -bottom-40 z-0 size-[500px] rounded-full bg-cyan-500/20 blur-[120px]"
        style={{ animation: "blobDrift 20s ease-in-out infinite reverse" }}
      />
      <div
        className="pointer-events-none fixed top-1/4 right-1/3 z-0 size-72 rounded-full bg-fuchsia-600/20 blur-[100px]"
        style={{ animation: "blobDrift 24s ease-in-out infinite" }}
      />

      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="solace-particle absolute rounded-full blur-[1px]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Back to home"
              className="rounded-full border border-white/15 bg-white/[0.04] p-2 text-white/60 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
            >
              <span aria-hidden>←</span>
            </Link>
            <div className="leading-tight">
              <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                Dashboard
              </h1>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
                Your wellness overview
              </p>
            </div>
          </div>
          <span className="hidden text-sm font-medium text-white/70 sm:block">
            {getGreeting()}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-16">
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Widget 1 — Wellness Score */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <h2 className="text-sm font-semibold text-white/80">Wellness Score</h2>
                <div className="relative mx-auto mt-5 size-40">
                  <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="10"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={RING_RADIUS}
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                      animate={{
                        strokeDashoffset:
                          RING_CIRCUMFERENCE *
                          (1 - animatedScore / 100),
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ filter: `drop-shadow(0 0 8px ${scoreColor}55)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-4xl font-black text-transparent">
                      {animatedScore}
                    </p>
                    <p className="mt-1 text-[10px] tracking-widest text-white/40 uppercase">
                      / 100
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                  <div>
                    <p className="text-lg">
                      {moodEntries.length > 0 ? avgMoodInfo.emoji : "—"}
                    </p>
                    <p className="mt-1 text-[10px] text-white/50">Avg Mood</p>
                    <p className="text-xs font-semibold text-white/80">
                      {moodEntries.length > 0 ? avgMood.toFixed(1) : "0.0"}
                    </p>
                  </div>
                  <div>
                    <PenLine className="mx-auto size-5 text-violet-400" />
                    <p className="mt-1 text-[10px] text-white/50">Entries</p>
                    <p className="text-xs font-semibold text-white/80">{journals.length}</p>
                  </div>
                  <div>
                    <MessageCircle className="mx-auto size-5 text-cyan-400" />
                    <p className="mt-1 text-[10px] text-white/50">Sessions</p>
                    <p className="text-xs font-semibold text-white/80">{sessions.length}</p>
                  </div>
                </div>
              </motion.section>

              {/* Widget 2 — Mood Trend Chart */}
              <motion.section
                id="mood-chart"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:col-span-2"
              >
                <h2 className="text-sm font-semibold text-white/80">Mood This Week</h2>
                {moodEntries.length === 0 ? (
                  <p className="py-16 text-center text-sm text-white/40">
                    Log your first mood to see trends
                  </p>
                ) : (
                  <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
                    {days.map((day) => {
                      const entry = entryForDay(day)
                      const moodInfo = entry
                        ? MOODS.find((m) => m.value === entry.mood)
                        : undefined
                      return (
                        <div
                          key={day.toISOString()}
                          className="group relative flex flex-1 flex-col items-center"
                        >
                          <div className="flex h-40 w-full items-end">
                            {entry && (
                              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0d0d0d]/90 px-3 py-1.5 text-xs whitespace-nowrap text-white/90 opacity-0 backdrop-blur-xl transition-opacity duration-200 group-hover:opacity-100">
                                <span className="mr-1">{moodInfo?.emoji}</span>
                                {entry.note ? entry.note : moodInfo?.label}
                              </div>
                            )}
                            <div
                              className={`w-full rounded-full transition-all duration-500 ${
                                entry
                                  ? "bg-gradient-to-t from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20"
                                  : "bg-white/10"
                              }`}
                              style={{
                                height: entry
                                  ? BAR_HEIGHTS[entry.mood] ?? "20%"
                                  : "8px",
                              }}
                            />
                          </div>
                          <span className="mt-2 text-xs text-white/40">
                            {WEEKDAYS[day.getDay()]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.section>

              {/* Widget 3 — Daily Affirmation */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                style={{
                  borderLeft: "4px solid",
                  borderImage:
                    "linear-gradient(to bottom, #8b5cf6, #22d3ee) 1",
                }}
              >
                <h2 className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Sparkles className="size-4 text-cyan-400" /> Daily Affirmation
                </h2>
                {affirmationLoading ? (
                  <div className="mt-5 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-full bg-white/[0.08]" />
                    <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/[0.08]" />
                  </div>
                ) : (
                  <p className="mt-5 text-sm leading-relaxed text-white/80 italic">
                    &ldquo;{affirmation}&rdquo;
                  </p>
                )}
                <button
                  onClick={fetchAffirmation}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs text-white/60 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
                >
                  <RefreshCw className="size-3" /> New Affirmation
                </button>
              </motion.section>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Widget 4 — Recent Journal Entries */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white/80">
                    Recent Journal Entries
                  </h2>
                  <Link
                    href="/journal"
                    className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-white"
                  >
                    View All <ArrowRight className="size-3" />
                  </Link>
                </div>

                {journals.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-white/40">No journal entries yet</p>
                    <Link
                      href="/journal"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03]"
                    >
                      <PenLine className="size-3.5" /> Write Your First Entry
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-3">
                    {journals.slice(0, 3).map((j) => {
                      const badge = j.sentiment
                        ? SENTIMENT_BADGE[j.sentiment]
                        : null
                      return (
                        <Link
                          key={j.id}
                          href="/journal"
                          className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-200 hover:border-violet-500/40"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-white">
                                {j.title}
                              </p>
                              {j.pinned && (
                                <Pin className="size-3 text-violet-400" />
                              )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-white/60">
                              {j.content.slice(0, 80)}
                              {j.content.length > 80 ? "..." : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            {badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            )}
                            <p className="text-[10px] text-white/30">
                              {new Date(j.updatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </motion.section>

              {/* Widget 5 — Recent Chat Sessions */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white/80">
                    Recent Chats
                  </h2>
                  <Link
                    href="/chat"
                    className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-white"
                  >
                    Open Chat <ArrowRight className="size-3" />
                  </Link>
                </div>

                {sessions.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-white/40">
                      Start your first conversation
                    </p>
                    <Link
                      href="/chat"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03]"
                    >
                      <MessageCircle className="size-3.5" /> Start Chatting
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    {sessions.slice(0, 3).map((s) => (
                      <Link
                        key={s.id}
                        href="/chat"
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors duration-200 hover:border-violet-500/40"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 truncate text-sm text-white/80">
                            {s.pinned && <Pin className="size-3 text-violet-400" />}
                            {s.title ?? "New Conversation"}
                          </p>
                          <p className="mt-0.5 text-[10px] text-white/30">
                            {new Date(s.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <MessageCircle className="size-4 shrink-0 text-white/30" />
                      </Link>
                    ))}
                  </div>
                )}
              </motion.section>
            </div>

            {/* Widget 6 — Breathing Exercise */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
            >
              <div className="flex flex-col items-center">
                <h2 className="text-sm font-semibold text-white/80">
                  4-7-8 Breathing
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Reduces anxiety in minutes
                </p>

                <div className="relative mt-10 flex h-56 w-56 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 opacity-60 blur-2xl"
                    animate={{ scale: breathingScale * 0.9 }}
                    transition={{ duration: breathingDuration, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="relative grid size-40 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 shadow-2xl shadow-violet-500/40"
                    animate={{ scale: breathingScale }}
                    transition={{ duration: breathingDuration, ease: "easeInOut" }}
                  >
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{phaseLabel}</p>
                      {phase !== "idle" && (
                        <p className="mt-1 text-2xl font-black text-white">
                          {countdown}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>

                <p className="mt-8 text-xs text-white/50">
                  {phase === "idle"
                    ? "Take a moment to center yourself."
                    : `Cycle ${Math.min(cycle + 1, 4)} of 4`}
                </p>

                <div className="mt-5 flex gap-3">
                  {phase === "idle" ? (
                    <button
                      onClick={() => {
                        setCycle(0)
                        setPhase("inhale")
                        setCountdown(4)
                      }}
                      className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03]"
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={stopBreathing}
                      className="rounded-full border border-white/15 bg-white/[0.04] px-8 py-3 text-sm font-semibold text-white/70 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Widget 7 — Quick Actions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {QUICK_ACTIONS.map((action) => {
                  const inner = (
                    <>
                      <span>{action.icon}</span>
                      <span className="text-xs font-medium text-white/70">
                        {action.label}
                      </span>
                    </>
                  )
                  if (action.href.startsWith("#")) {
                    return (
                      <a
                        key={action.label}
                        href={action.href}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-5 transition-all duration-200 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/20"
                      >
                        {inner}
                      </a>
                    )
                  }
                  return (
                    <motion.div
                      key={action.label}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={action.href}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-5 transition-all duration-200 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/20"
                      >
                        {inner}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          </div>
        )}
      </main>
    </div>
  )
}
