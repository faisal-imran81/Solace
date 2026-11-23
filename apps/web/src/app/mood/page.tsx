"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GardenBackdrop, GardenNook } from "@/components/brand/Garden"
import { PageHeader } from "@/components/app/PageHeader"
import { MobileNav } from "@/components/landing/MobileNav"

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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <style>{`
        @keyframes toastIn {
          0% { opacity: 0; transform: translate(-50%, 12px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -8px); }
        }
        .solace-toast { animation: toastIn 2s ease-in-out both; }
      `}</style>

      <GardenBackdrop />

      <PageHeader title="Mood Tracker" subtitle="How are you feeling?" width="3xl" />

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-24 pb-28 sm:pt-28 sm:pb-16">
        <section className="surface animate-rise rounded-3xl p-5 sm:p-8">
          <h2 className="font-heading text-2xl font-normal text-foreground sm:text-3xl">
            How are you feeling right now?
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            There&apos;s no right answer. Pick whichever feels closest.
          </p>

          <div role="radiogroup" aria-label="Mood" className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
            {MOODS.map((m) => {
              const selected = selectedMood === m.value
              return (
                <button
                  key={m.value}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedMood(m.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border px-1 py-3 text-center transition-all duration-300 ease-out sm:p-4 ${
                    selected
                      ? "-translate-y-0.5 border-sage bg-sage-soft shadow-soft"
                      : "cursor-pointer border-border bg-background hover:-translate-y-0.5 hover:border-line-strong"
                  }`}
                >
                  <span className="text-2xl sm:text-4xl">{m.emoji}</span>
                  <span
                    className={`text-[11px] leading-tight font-medium sm:text-xs ${
                      selected ? "text-sage-strong" : "text-muted-foreground"
                    }`}
                  >
                    {m.label}
                  </span>
                </button>
              )
            })}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Add a note... (optional)"
            className="mt-6 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint outline-none transition-colors duration-300 focus:border-ring"
          />

          <button
            onClick={handleSubmit}
            disabled={selectedMood === null || isSubmitting}
            className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Saving..." : "Save Mood"}
          </button>
        </section>

        <section className="surface animate-rise mt-6 overflow-hidden rounded-3xl p-5 [animation-delay:80ms] sm:p-8">
          <h2 className="font-heading text-xl font-normal text-foreground">Your mood this week</h2>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-sage border-t-transparent" />
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <GardenNook className="size-24" />
              <p className="mt-4 text-sm text-muted-foreground">
                No moods logged yet. Pick one above to get started.
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
                          height: entry ? BAR_HEIGHTS[entry.mood] ?? "20%" : "8px",
                        }}
                        transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className={`w-full ${
                          entry ? "rounded-t-full rounded-b-md bg-sage" : "rounded-full bg-muted"
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
        </section>
      </main>

      {toast && (
        <div
          role="status"
          className="solace-toast fixed bottom-24 left-1/2 z-50 rounded-full border border-border bg-card px-5 py-2.5 text-sm text-foreground shadow-lift sm:bottom-6"
        >
          Mood saved 🌿
        </div>
      )}

      <MobileNav />
    </div>
  )
}
