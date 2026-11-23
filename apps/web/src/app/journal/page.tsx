"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, PenLine, Trash2, Plus, Pin, Leaf, ArrowLeft } from "lucide-react"
import { GardenBackdrop, GardenNook } from "@/components/brand/Garden"
import { PageHeader } from "@/components/app/PageHeader"
import { MobileNav } from "@/components/landing/MobileNav"

type Journal = {
  id: string
  title: string
  content: string
  pinned: boolean
  sentiment: string | null
  createdAt: string
  updatedAt: string
}


const SENTIMENT_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  positive: { label: "😊 Positive", className: "bg-sage-soft text-sage-strong" },
  negative: { label: "😔 Difficult", className: "bg-clay-soft text-clay-strong" },
  neutral: { label: "😐 Neutral", className: "bg-muted text-muted-foreground" },
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
          const analyzeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/journal/analyze`, {
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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="surface group relative flex flex-col rounded-3xl p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
      >
        {badge && (
          <span
            className={`absolute top-5 right-5 rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        )}

        <button
          onClick={() => openEditor(j)}
          className="flex min-h-24 flex-1 flex-col rounded-xl text-left"
        >
          <h3 className="pr-24 font-heading text-xl font-medium text-foreground">{j.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {j.content}
          </p>
        </button>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-faint">
              {wordCount(j.content)} words · {readTime(j.content)}
            </p>
            <p className="text-xs text-faint sm:hidden">{formatDate(j.updatedAt)}</p>
          </div>
          <p className="hidden text-xs text-faint transition-opacity duration-200 sm:block sm:group-hover:opacity-0 sm:group-focus-within:opacity-0">{formatDate(j.updatedAt)}</p>
        </div>

        <div className="absolute right-4 bottom-3 flex gap-1 rounded-xl bg-card opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            onClick={() => pinJournal(j.id, j.pinned)}
            aria-label="Pin journal"
            className={`rounded-lg p-1.5 transition-colors ${
              j.pinned ? "bg-sage-soft text-sage-strong" : "text-faint hover:bg-muted hover:text-foreground"
            }`}
          >
            <Pin className="size-4" />
          </button>
          <button
            onClick={() => openEditor(j)}
            aria-label="Edit journal"
            className="rounded-lg p-1.5 text-faint transition-colors hover:bg-muted hover:text-foreground"
          >
            <PenLine className="size-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmId(j.id)}
            aria-label="Delete journal"
            className="rounded-lg p-1.5 text-faint transition-colors hover:bg-destructive-soft hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <GardenBackdrop />

      <PageHeader title="My Journal" subtitle="Your private space">
        {view === "list" && (
          <button
            onClick={() => openEditor()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <Plus className="size-4" /> New Entry
          </button>
        )}
      </PageHeader>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-28 sm:pt-28 sm:pb-16">
        {view === "list" ? (
          <div className="flex flex-col gap-8">
            <div className="relative mx-auto w-full max-w-md">
              <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your journal..."
                className="w-full rounded-full border border-input bg-card py-3 pr-4 pl-11 text-sm text-foreground placeholder:text-faint shadow-soft outline-none transition-colors duration-300 focus:border-ring"
              />
            </div>

            {journals.length === 0 ? (
              <div className="animate-rise flex flex-col items-center justify-center pt-12 text-center">
                <GardenNook />
                <h2 className="mt-6 font-heading text-3xl font-normal text-foreground">
                  Your journal is empty
                </h2>
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                  Write about your day, a worry, anything at all. Only you can read it.
                </p>
                <button
                  onClick={() => openEditor()}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-colors duration-200 hover:bg-primary/90"
                >
                  <Plus className="size-4" /> Write First Entry
                </button>
              </div>
            ) : filteredJournals.length === 0 ? (
              <p className="pt-16 text-center text-sm text-muted-foreground">
                No entries match &quot;{search}&quot;
              </p>
            ) : (
              <>
                {pinnedJournals.length > 0 && (
                  <section>
                    <p className="mb-4 flex items-center gap-1.5 px-1 text-xs font-semibold tracking-[0.16em] text-sage-strong uppercase">
                      <Pin className="size-3.5" /> Pinned
                    </p>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {pinnedJournals.map(renderJournalCard)}
                    </div>
                  </section>
                )}
                {unpinnedJournals.length > 0 && (
                  <section>
                    <p className="mb-4 px-1 text-xs font-semibold tracking-[0.16em] text-faint uppercase">
                      {pinnedJournals.length > 0 ? "All Entries" : "Your Entries"}
                    </p>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {unpinnedJournals.map(renderJournalCard)}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col pt-2">
            <button
              onClick={closeEditor}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:border-line-strong hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back
            </button>

            <div className="surface animate-rise flex flex-1 flex-col rounded-3xl px-5 py-6 sm:px-10 sm:py-10">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                className="w-full border-0 bg-transparent font-heading text-3xl font-normal text-foreground placeholder:text-faint focus:outline-none"
              />

              <div className="my-5 h-px bg-gradient-to-r from-sage/60 via-border to-transparent" />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today?"
                className="min-h-[40vh] w-full flex-1 resize-none border-0 bg-transparent text-base leading-loose text-foreground placeholder:text-faint focus:outline-none"
              />
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md">
              <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                <p className="text-xs text-faint">
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
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {(isSaving || isAnalyzing) && (
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Save & Analyze"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {reflection && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-x-0 bottom-20 z-40 px-4"
                >
                  <div className="leaf-corner mx-auto max-w-3xl border border-sage/40 bg-sage-soft p-6 shadow-float">
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-sm font-semibold text-sage-strong">
                        <Leaf className="size-4" strokeWidth={1.75} /> Solace&apos;s Reflection
                      </p>
                      {sentiment && SENTIMENT_BADGE[sentiment] && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${SENTIMENT_BADGE[sentiment].className}`}
                        >
                          {SENTIMENT_BADGE[sentiment].label}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-heading text-lg leading-relaxed text-foreground">
                      {reflection}
                    </p>
                    <div className="mt-5 flex justify-end gap-3">
                      <button
                        onClick={() => setReflection(null)}
                        className="rounded-full border border-line-strong bg-card/70 px-5 py-2 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-card"
                      >
                        Continue Writing
                      </button>
                      <button
                        onClick={closeEditor}
                        className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
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
              className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-entry-title"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.25 }}
              className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-popover p-6 shadow-float"
            >
              <h3 id="delete-entry-title" className="font-heading text-xl font-medium text-foreground">Delete this entry?</h3>
              <p className="mt-2 text-sm text-muted-foreground">This cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="rounded-full border border-line-strong px-5 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteJournal(deleteConfirmId)}
                  className="rounded-full bg-destructive px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {view === "list" && <MobileNav />}
    </div>
  )
}
