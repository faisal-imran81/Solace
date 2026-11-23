"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { GardenBackdrop, GardenNook } from "@/components/brand/Garden"
import { PageHeader } from "@/components/app/PageHeader"
import { MobileNav } from "@/components/landing/MobileNav"
import {
  Leaf,
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
  positive: { label: "😊 Positive", className: "bg-sage-soft text-sage-strong" },
  negative: { label: "😔 Difficult", className: "bg-clay-soft text-clay-strong" },
  neutral: { label: "😐 Neutral", className: "bg-muted text-muted-foreground" },
}


type QuickAction = {
  icon: ReactNode
  label: string
  href: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: <MessageCircle className="size-5 text-sage-strong" strokeWidth={1.75} />, label: "New Chat", href: "/chat" },
  { icon: <PenLine className="size-5 text-sage-strong" strokeWidth={1.75} />, label: "New Journal", href: "/journal" },
  { icon: <Smile className="size-5 text-clay-strong" strokeWidth={1.75} />, label: "Log Mood", href: "/mood" },
  { icon: <BarChart3 className="size-5 text-sage-strong" strokeWidth={1.75} />, label: "View Stats", href: "#mood-chart" },
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
        "Some days are harder than others. Getting through this one still counts. 🌿",
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
      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    )
  }

  const card = "surface rounded-3xl p-6"
  const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  }
  const calm = [0.22, 1, 0.36, 1] as const

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <GardenBackdrop />

      <PageHeader title="Dashboard" subtitle="Your wellness overview" />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-28 sm:pt-28 sm:pb-16">
        <div className="animate-rise mb-8">
          <p className="font-heading text-3xl font-normal text-foreground sm:text-4xl">
            {getGreeting()}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s a gentle look at your week.
          </p>
        </div>

        {loading ? (
          renderSkeleton()
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 lg:grid-cols-3">
              {/* Widget 1: Wellness Score */}
              <motion.section {...reveal} transition={{ duration: 0.7, ease: calm }} className={card}>
                <h2 className="font-heading text-lg font-medium text-foreground">Wellness Score</h2>
                <p className="text-xs text-faint">From your recent check-ins. A rough guide, not a grade.</p>
                <div className="relative mx-auto mt-5 size-40">
                  <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r={RING_RADIUS}
                      fill="none"
                      className="stroke-muted"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={RING_RADIUS}
                      fill="none"
                      className="stroke-sage"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                      animate={{
                        strokeDashoffset:
                          RING_CIRCUMFERENCE *
                          (1 - animatedScore / 100),
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-heading text-4xl font-light text-foreground">
                      {animatedScore}
                    </p>
                    <p className="text-[11px] text-faint">
                      / 100
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                  <div>
                    <p className="text-lg">
                      {moodEntries.length > 0 ? avgMoodInfo.emoji : "—"}
                    </p>
                    <p className="mt-1 text-[11px] text-faint">Avg Mood</p>
                    <p className="text-xs font-semibold text-foreground">
                      {moodEntries.length > 0 ? avgMood.toFixed(1) : "0.0"}
                    </p>
                  </div>
                  <div>
                    <PenLine className="mx-auto size-5 text-sage-strong" strokeWidth={1.75} />
                    <p className="mt-1 text-[11px] text-faint">Entries</p>
                    <p className="text-xs font-semibold text-foreground">{journals.length}</p>
                  </div>
                  <div>
                    <MessageCircle className="mx-auto size-5 text-clay-strong" strokeWidth={1.75} />
                    <p className="mt-1 text-[11px] text-faint">Sessions</p>
                    <p className="text-xs font-semibold text-foreground">{sessions.length}</p>
                  </div>
                </div>
              </motion.section>

              {/* Widget 2: Mood Trend Chart */}
              <motion.section
                id="mood-chart"
                {...reveal}
                transition={{ duration: 0.7, delay: 0.08, ease: calm }}
                className={`${card} scroll-mt-24 lg:col-span-2`}
              >
                <h2 className="font-heading text-lg font-medium text-foreground">Mood This Week</h2>
                {moodEntries.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <GardenNook className="size-24" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Log your first mood to see trends
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 flex h-40 items-end gap-2 sm:gap-3">
                    {days.map((day, i) => {
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
                              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-xl border border-border bg-popover px-3 py-1.5 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100">
                                <span className="mr-1">{moodInfo?.emoji}</span>
                                {entry.note ? entry.note : moodInfo?.label}
                              </div>
                            )}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{
                                height: entry
                                  ? BAR_HEIGHTS[entry.mood] ?? "20%"
                                  : "8px",
                              }}
                              transition={{ duration: 0.9, delay: i * 0.06, ease: calm }}
                              className={`w-full ${
                                entry
                                  ? "rounded-t-full rounded-b-md bg-sage"
                                  : "rounded-full bg-muted"
                              }`}
                            />
                          </div>
                          <span className="mt-2 text-xs text-faint">
                            {WEEKDAYS[day.getDay()]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.section>

              {/* Widget 3: Daily Affirmation */}
              <motion.section
                {...reveal}
                transition={{ duration: 0.7, delay: 0.16, ease: calm }}
                className="leaf-corner relative overflow-hidden bg-clay-soft p-6 lg:col-span-3"
              >
                <svg aria-hidden viewBox="0 0 100 100" className="absolute -top-6 -right-6 w-32 text-clay/20">
                  <path fill="currentColor" d="M12 88C12 44 40 14 88 12c0 48-30 76-76 76Z" />
                </svg>
                <h2 className="relative flex items-center gap-2 text-sm font-semibold text-clay-strong">
                  <Leaf className="size-4" strokeWidth={1.75} /> Daily Affirmation
                </h2>
                {affirmationLoading ? (
                  <div className="relative mt-5 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-full bg-clay/20" />
                    <div className="h-3 w-3/4 animate-pulse rounded-full bg-clay/20" />
                  </div>
                ) : (
                  <p className="relative mt-4 max-w-3xl font-heading text-xl leading-relaxed text-foreground italic">
                    &ldquo;{affirmation}&rdquo;
                  </p>
                )}
                <button
                  onClick={fetchAffirmation}
                  className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-clay/30 bg-card/60 px-4 py-1.5 text-xs font-medium text-clay-strong transition-colors duration-200 hover:bg-card"
                >
                  <RefreshCw className="size-3" /> New Affirmation
                </button>
              </motion.section>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {/* Widget 4: Recent Journal Entries */}
              <motion.section
                {...reveal}
                transition={{ duration: 0.7, delay: 0.08, ease: calm }}
                className={`${card} lg:col-span-2`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-medium text-foreground">
                    Recent Journal Entries
                  </h2>
                  <Link
                    href="/journal"
                    className="flex items-center gap-1 rounded-full text-xs font-medium text-sage-strong transition-colors hover:text-foreground"
                  >
                    View All <ArrowRight className="size-3" />
                  </Link>
                </div>

                {journals.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">No journal entries yet</p>
                    <Link
                      href="/journal"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
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
                          className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition-colors duration-200 hover:border-line-strong"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {j.title}
                              </p>
                              {j.pinned && (
                                <Pin className="size-3 text-sage-strong" />
                              )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {j.content.slice(0, 80)}
                              {j.content.length > 80 ? "..." : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            {badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            )}
                            <p className="text-[11px] text-faint">
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

              {/* Widget 5: Recent Chat Sessions */}
              <motion.section
                {...reveal}
                transition={{ duration: 0.7, delay: 0.16, ease: calm }}
                className={card}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-medium text-foreground">
                    Recent Chats
                  </h2>
                  <Link
                    href="/chat"
                    className="flex items-center gap-1 rounded-full text-xs font-medium text-sage-strong transition-colors hover:text-foreground"
                  >
                    Open Chat <ArrowRight className="size-3" />
                  </Link>
                </div>

                {sessions.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      Start your first conversation
                    </p>
                    <Link
                      href="/chat"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
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
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3 transition-colors duration-200 hover:border-line-strong"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 truncate text-sm text-foreground">
                            {s.pinned && <Pin className="size-3 shrink-0 text-sage-strong" />}
                            {s.title ?? "New Conversation"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-faint">
                            {new Date(s.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <MessageCircle className="size-4 shrink-0 text-faint" />
                      </Link>
                    ))}
                  </div>
                )}
              </motion.section>
            </div>

            {/* Widget 6: Breathing Exercise */}
            <motion.section
              {...reveal}
              transition={{ duration: 0.7, delay: 0.12, ease: calm }}
              className="surface relative overflow-hidden rounded-3xl p-8"
            >
              <div className="flex flex-col items-center">
                <h2 className="font-heading text-2xl font-normal text-foreground">
                  4-7-8 Breathing
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  In for 4, hold for 7, out for 8
                </p>

                <div className="relative mt-10 flex h-60 w-60 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-sage-soft"
                    animate={{ scale: breathingScale * 0.72 }}
                    transition={{ duration: breathingDuration, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-6 rounded-full border border-sage/50"
                    animate={{ scale: breathingScale * 0.8 }}
                    transition={{ duration: breathingDuration, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="relative grid size-32 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift"
                    animate={{ scale: breathingScale * 0.85 }}
                    transition={{ duration: breathingDuration, ease: "easeInOut" }}
                  >
                    <div className="text-center" aria-live="polite">
                      <p className="text-sm font-semibold">{phaseLabel}</p>
                      {phase !== "idle" && (
                        <p className="mt-0.5 font-heading text-3xl font-light">
                          {countdown}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>

                <p className="mt-8 text-sm text-muted-foreground">
                  {phase === "idle"
                    ? "Four slow rounds. Press start when you're ready."
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
                      className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={stopBreathing}
                      className="rounded-full border border-line-strong bg-background px-8 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Widget 7: Quick Actions */}
            <motion.section
              {...reveal}
              transition={{ duration: 0.7, delay: 0.16, ease: calm }}
              className="surface rounded-3xl p-3 sm:p-4"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {QUICK_ACTIONS.map((action) => {
                  const inner = (
                    <>
                      <span className="grid size-11 place-items-center rounded-[45%_55%_50%_50%/55%_45%_55%_45%] bg-muted">
                        {action.icon}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {action.label}
                      </span>
                    </>
                  )
                  const tile =
                    "flex flex-col items-center gap-2 rounded-2xl border border-border bg-background py-5 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-soft"
                  if (action.href.startsWith("#")) {
                    return (
                      <a key={action.label} href={action.href} className={tile}>
                        {inner}
                      </a>
                    )
                  }
                  return (
                    <motion.div
                      key={action.label}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={action.href} className={tile}>
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

      <MobileNav />
    </div>
  )
}
