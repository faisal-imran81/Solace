"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { Search, PenLine, Trash2, Plus } from "lucide-react"

type Journal = {
  id: string
  title: string
  content: string
  pinned: boolean
  sentiment: string | null
  createdAt: string
  updatedAt: string
}

const PARTICLES = [
  { top: "16%", left: "10%", size: 5, delay: 0, color: "rgba(34,211,238,0.7)" },
  { top: "30%", left: "86%", size: 4, delay: 0.6, color: "rgba(217,70,239,0.6)" },
  { top: "62%", left: "6%", size: 5, delay: 1.2, color: "rgba(139,92,246,0.7)" },
  { top: "74%", left: "90%", size: 3, delay: 0.3, color: "rgba(34,211,238,0.6)" },
  { top: "46%", left: "94%", size: 4, delay: 0.9, color: "rgba(139,92,246,0.6)" },
]

const SENTIMENT_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  positive: { label: "😊 Positive", className: "bg-emerald-500/20 text-emerald-400" },
  negative: { label: "😔 Difficult", className: "bg-rose-500/20 text-rose-400" },
  neutral: { label: "😐 Neutral", className: "bg-blue-500/20 text-blue-400" },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [view, setView] = useState<"list" | "editor">("list")
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [search, setSearch] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [reflection, setReflection] = useState<string | null>(null)
  const [sentiment, setSentiment] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  async function fetchJournals() {
    try {
      const res = await fetch("/api/journal")
      if (!res.ok) return
      const data = await res.json()
      setJournals(data.journals ?? [])
    } catch {
      /* silent */
    }
  }

  useEffect(() => {
    fetchJournals()
  }, [])

  function openEditor(journal?: Journal) {
    if (journal) {
      setEditingJournal(journal)
      setTitle(journal.title)
      setContent(journal.content)
    } else {
      setEditingJournal(null)
      setTitle("")
      setContent("")
    }
    setReflection(null)
    setSentiment(null)
    setView("editor")
  }

  function closeEditor() {
    setView("list")
    setEditingJournal(null)
    setTitle("")
    setContent("")
    setReflection(null)
    setSentiment(null)
    fetchJournals()
  }

  async function saveJournal() {
    if (!title.trim() || !content.trim()) return
    setIsSaving(true)
    let journalId: string | null = null
    try {
      if (editingJournal) {
        const res = await fetch(`/api/journal/${editingJournal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        })
        if (!res.ok) throw new Error("Failed to save")
        const data = await res.json()
        journalId = data.journal?.id ?? editingJournal.id
      } else {
        const res = await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, sentiment: null, pinned: false }),
        })
        if (!res.ok) throw new Error("Failed to save")
        const data = await res.json()
        journalId = data.journal?.id
      }

      if (journalId) {
        setIsAnalyzing(true)
        try {
          const analyzeRes = await fetch("http://localhost:8000/api/v1/journal/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          })
          if (analyzeRes.ok) {
            const analysis = await analyzeRes.json()
            const s = analysis.sentiment
            const r = analysis.reflection
            setSentiment(s ?? null)
            setReflection(r ?? null)
            await fetch(`/api/journal/${journalId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sentiment: s ?? null }),
            })
          }
        } catch {
          /* analyze is optional — entry is still saved */
        } finally {
          setIsAnalyzing(false)
        }
      }
    } catch {
      /* silent */
    } finally {
      setIsSaving(false)
      fetchJournals()
    }
  }

  async function deleteJournal(id: string) {
    try {
      await fetch(`/api/journal/${id}`, { method: "DELETE" })
      await fetchJournals()
    } catch {
      /* silent */
    }
    setDeleteConfirmId(null)
  }

  async function pinJournal(id: string, pinned: boolean) {
    try {
      await fetch(`/api/journal/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !pinned }),
      })
      setJournals((prev) =>
        prev
          .map((j) => (j.id === id ? { ...j, pinned: !pinned } : j))
          .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1
            if (!a.pinned && b.pinned) return 1
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          }),
      )
    } catch {
      /* silent */
    }
  }

  function wordCount(text: string) {
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  function readTime(text: string) {
    return Math.max(1, Math.ceil(wordCount(text) / 200)) + " min read"
  }

  const filteredJournals = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return journals
    return journals.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.content.toLowerCase().includes(q),
    )
  }, [journals, search])

  const pinnedJournals = filteredJournals.filter((j) => j.pinned)
  const unpinnedJournals = filteredJournals.filter((j) => !j.pinned)

  function renderJournalCard(j: Journal) {
    const badge = j.sentiment ? SENTIMENT_BADGE[j.sentiment] : null
    return (
      <motion.div
        key={j.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
      >
        {badge && (
          <span
            className={`absolute top-4 right-4 rounded-full px-2.5 py-1 text-[10px] font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        )}

        <button
          onClick={() => openEditor(j)}
          className="flex min-h-24 flex-1 flex-col text-left"
        >
          <h3 className="pr-20 text-lg font-semibold text-white">{j.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">
            {j.content}
          </p>
        </button>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-xs text-white/40">
            {wordCount(j.content)} words · {readTime(j.content)}
          </p>
          <p className="text-xs text-white/40">{formatDate(j.updatedAt)}</p>
        </div>

        <div className="absolute right-4 bottom-4 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() => pinJournal(j.id, j.pinned)}
            aria-label="Pin journal"
            className={`rounded-lg p-1.5 transition-colors ${
              j.pinned ? "bg-violet-500/20 text-violet-400" : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            📌
          </button>
          <button
            onClick={() => openEditor(j)}
            aria-label="Edit journal"
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PenLine className="size-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmId(j.id)}
            aria-label="Delete journal"
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </motion.div>
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
        @keyframes toastIn {
          0% { opacity: 0; transform: translate(-50%, 12px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -8px); }
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
                My Journal
              </h1>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
                Your private space
              </p>
            </div>
          </div>

          {view === "list" && (
            <button
              onClick={() => openEditor()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03]"
            >
              <Plus className="size-4" /> New Entry
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-16">
        {view === "list" ? (
          <div className="flex flex-col gap-8">
            <div className="relative mx-auto w-full max-w-md">
              <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your journal..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pr-4 pl-11 text-sm text-white/90 placeholder:text-white/40 backdrop-blur-xl outline-none transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06]"
              />
            </div>

            {journals.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-24 text-center">
                <div className="relative">
                  <div className="absolute inset-0 -z-10 size-16 rounded-2xl bg-violet-500/30 blur-2xl" />
                  <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-xl shadow-violet-500/30">
                    <PenLine className="size-8 text-white" />
                  </span>
                </div>
                <h2 className="mt-6 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                  Start your healing journey
                </h2>
                <p className="mt-3 text-sm text-white/60">
                  Write freely. This is your safe space.
                </p>
                <button
                  onClick={() => openEditor()}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03]"
                >
                  <Plus className="size-4" /> Write First Entry
                </button>
              </div>
            ) : filteredJournals.length === 0 ? (
              <p className="pt-16 text-center text-sm text-white/40">
                No entries match &quot;{search}&quot;
              </p>
            ) : (
              <>
                {pinnedJournals.length > 0 && (
                  <section>
                    <p className="mb-4 px-1 text-xs font-semibold tracking-[0.2em] text-violet-400/60 uppercase">
                      📌 Pinned
                    </p>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {pinnedJournals.map(renderJournalCard)}
                    </div>
                  </section>
                )}
                {unpinnedJournals.length > 0 && (
                  <section>
                    <p className="mb-4 px-1 text-xs font-semibold tracking-[0.2em] text-cyan-400/60 uppercase">
                      {pinnedJournals.length > 0 ? "All Entries" : "Your Entries"}
                    </p>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {unpinnedJournals.map(renderJournalCard)}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col pt-4">
            <button
              onClick={closeEditor}
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/60 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
            >
              <span aria-hidden>←</span> Back
            </button>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title..."
              className="w-full border-0 bg-transparent text-2xl font-bold text-white placeholder:text-white/30 focus:outline-none"
            />

            <div className="my-4 h-px bg-gradient-to-r from-violet-500/40 via-white/10 to-transparent" />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely. This is your safe space..."
              className="min-h-[40vh] w-full flex-1 resize-none border-0 bg-transparent text-base leading-relaxed text-white/80 placeholder:text-white/30 focus:outline-none"
            />

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
                <p className="text-xs text-white/40">
                  {wordCount(content)} words · {readTime(content)}
                </p>
                <button
                  onClick={saveJournal}
                  disabled={
                    isSaving ||
                    isAnalyzing ||
                    !title.trim() ||
                    !content.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {(isSaving || isAnalyzing) && (
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Save & Analyze"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {reflection && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-x-0 bottom-20 z-40 px-4"
                >
                  <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-2xl shadow-black/40">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">
                        ✨ Solace&apos;s Reflection
                      </p>
                      {sentiment && SENTIMENT_BADGE[sentiment] && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${SENTIMENT_BADGE[sentiment].className}`}
                        >
                          {SENTIMENT_BADGE[sentiment].label}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      {reflection}
                    </p>
                    <div className="mt-5 flex justify-end gap-3">
                      <button
                        onClick={() => setReflection(null)}
                        className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-xs font-medium text-white/70 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
                      >
                        Continue Writing
                      </button>
                      <button
                        onClick={closeEditor}
                        className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03]"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#1a1a2e] p-6 shadow-2xl shadow-black/60"
            >
              <h3 className="text-lg font-semibold text-white">Delete this entry?</h3>
              <p className="mt-2 text-sm text-white/60">This cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-sm text-white/70 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteJournal(deleteConfirmId)}
                  className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition-all duration-200 hover:scale-[1.03]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
