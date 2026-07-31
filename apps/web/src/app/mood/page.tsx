"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type MoodEntry = {
  id: string
  mood: number
  note: string | null
  createdAt: string
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

const PARTICLES = [
  { top: "16%", left: "10%", size: 5, delay: 0, color: "rgba(34,211,238,0.7)" },
  { top: "30%", left: "86%", size: 4, delay: 0.6, color: "rgba(217,70,239,0.6)" },
  { top: "62%", left: "6%", size: 5, delay: 1.2, color: "rgba(139,92,246,0.7)" },
  { top: "74%", left: "90%", size: 3, delay: 0.3, color: "rgba(34,211,238,0.6)" },
  { top: "46%", left: "94%", size: 4, delay: 0.9, color: "rgba(139,92,246,0.6)" },
]

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(false)
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchMoods() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/mood")
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setEntries(data.entries ?? [])
    } catch {
      setError("Couldn't load your mood history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoods()
  }, [])

  async function handleSubmit() {
    if (selectedMood === null || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood, note: note.trim() || undefined }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setToast(true)
      setNote("")
      setSelectedMood(null)
      await fetchMoods()
      setTimeout(() => setToast(false), 2000)
    } catch {
      setError("Couldn't save your mood. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const days = getLast7Days()

  function entryForDay(day: Date) {
    return entries.find((e) => {
      const c = new Date(e.createdAt)
      return (
        c.getFullYear() === day.getFullYear() &&
        c.getMonth() === day.getMonth() &&
        c.getDate() === day.getDate()
      )
    })
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
        @keyframes toastIn {
          0% { opacity: 0; transform: translate(-50%, 12px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -8px); }
        }
        .solace-toast { animation: toastIn 2s ease-in-out both; }
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
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
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
                Mood Tracker
              </h1>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
                How are you feeling?
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-24 pb-16">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white/90">
            How are you feeling right now?
          </h2>

          <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-white/30 sm:p-5 ${
                  selectedMood === m.value
                    ? "scale-110 border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/20"
                    : "cursor-pointer"
                }`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-xs font-medium text-white/60">{m.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Add a note... (optional)"
            className="mt-6 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/90 placeholder:text-white/40 backdrop-blur-xl outline-none transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06]"
          />

          <button
            onClick={handleSubmit}
            disabled={selectedMood === null || isSubmitting}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Saving..." : "Save Mood"}
          </button>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white/90">Your mood this week</h2>

          {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            </div>
          ) : entries.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/40">
              No mood data yet — start by logging today&apos;s mood!
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
        </section>
      </main>

      {toast && (
        <div className="solace-toast fixed bottom-6 left-1/2 z-50 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-white shadow-lg shadow-violet-500/20 backdrop-blur-xl">
          Mood saved! 💜
        </div>
      )}
    </div>
  )
}
