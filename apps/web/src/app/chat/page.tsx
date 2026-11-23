"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  PenLine,
  Pin,
  Link2,
  Trash2,
  MessageSquare,
  Plus,
  X,
  MoreHorizontal,
  PanelLeft,
  ArrowLeft,
  SmilePlus,
  NotebookPen,
  LifeBuoy,
  SendHorizontal,
} from "lucide-react"
import { LogoMark } from "@/components/brand/Logo"
import { GardenBackdrop, GardenNook } from "@/components/brand/Garden"

const ERROR_MESSAGE = "Something went wrong. Please try again."

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "don't want to live",
  "self harm", "hurt myself", "want to die", "no reason to live",
  "can't go on", "give up on life",
]

function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase()
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw))
}

const SUGGESTIONS = ["I'm feeling anxious", "I need to talk", "Help me calm down"]

type Message = { role: "user" | "assistant"; content: string }

type Session = {
  id: string
  title: string | null
  pinned: boolean
  createdAt: string
  updatedAt: string
}

const GROQ_API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/chat/`


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [showCrisisBanner, setShowCrisisBanner] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loadingSession, setLoadingSession] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesRef = useRef<Message[]>([])
  messagesRef.current = messages

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => {
    fetchSessions()
  }, [])

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null)
    }
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [openMenuId])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`
  }

  async function createSession(): Promise<string | null> {
    try {
      const res = await fetch("/api/chat/session", { method: "POST" })
      if (!res.ok) return null
      const data = await res.json()
      return data.sessionId
    } catch {
      return null
    }
  }

  async function saveMessage(
    sid: string,
    role: "user" | "assistant",
    content: string,
  ) {
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, role, content }),
      })
    } catch {
      /* silent fail */
    }
  }

  async function sendMessage(raw: string) {
    const text = raw.trim()
    if (!text || isStreaming) return

    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    let sid = sessionId
    const isNewSession = !sid
    if (!sid) {
      sid = await createSession()
      if (sid) setSessionId(sid)
    }

    setMessages((prev) => [...prev, { role: "user", content: text }])
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])
    setIsStreaming(true)

    if (detectCrisis(text)) setShowCrisisBanner(true)
    if (sid) {
      await saveMessage(sid, "user", text)
      // Auto-title on first message of new session
      if (isNewSession) {
        await updateSessionTitle(sid, text)
        fetchSessions()
      }
    }

    const history = [...messagesRef.current, { role: "user", content: text }]

    let fullResponse = ""

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })
      if (!res.ok || !res.body) throw new Error("Request failed")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const token = line.slice(6)
            if (!token || token === "[DONE]") continue
            appendToken(token)
            fullResponse += token
          }
        }
      }

      if (buffer.startsWith("data: ")) {
        const token = buffer.slice(6)
        if (token && token !== "[DONE]") {
          appendToken(token)
          fullResponse += token
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === "assistant" && last.content === "") {
          next[next.length - 1] = { role: "assistant", content: ERROR_MESSAGE }
        } else {
          next.push({ role: "assistant", content: ERROR_MESSAGE })
        }
        return next
      })
    } finally {
      if (sid && fullResponse) await saveMessage(sid, "assistant", fullResponse)
      setIsStreaming(false)
      fetchSessions()
    }
  }

  function appendToken(token: string) {
    setMessages((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      next[next.length - 1] = {
        role: "assistant",
        content: last?.role === "assistant" ? last.content + token : token,
      }
      return next
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleChip(chip: string) {
    if (isStreaming) return
    sendMessage(chip)
  }

  function newChat() {
    setIsStreaming(false)
    setInput("")
    setMessages([])
    setSessionId(null)
    setShowCrisisBanner(false)
    setSidebarOpen(false)
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  // Fetch all sessions from DB
  async function fetchSessions() {
    try {
      const res = await fetch("/api/chat/session")
      if (!res.ok) return
      const data = await res.json()
      // API returns { sessions: [...] }
      setSessions(Array.isArray(data) ? data : data.sessions ?? [])
    } catch {
      /* silent */
    }
  }

  // Load a previous session's messages
  async function loadSession(sid: string) {
    if (isStreaming) return
    setLoadingSession(true)
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sid}`)
      if (!res.ok) return
      const data: { messages: Array<{ role: "user" | "assistant"; content: string }> } =
        await res.json()
      setMessages(
        (data.messages ?? []).map((m) => ({ role: m.role, content: m.content })),
      )
      setSessionId(sid)
      setShowCrisisBanner(false)
      setSidebarOpen(false)
    } catch {
      /* silent */
    } finally {
      setLoadingSession(false)
    }
  }

  // Auto-update session title from first user message
  async function updateSessionTitle(sid: string, firstMessage: string) {
    try {
      const raw = firstMessage.trim()
      const title = raw.slice(0, 45) + (raw.length > 45 ? "..." : "")
      const res = await fetch("/api/chat/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, title }),
      })
      if (!res.ok) {
        const err = await res.json()
        console.error("Title update failed:", err)
      }
      // Refresh sessions list immediately
      await fetchSessions()
    } catch (e) {
      console.error("updateSessionTitle error:", e)
    }
  }

  async function deleteSession(sid: string) {
    try {
      await fetch(`/api/chat/session?sessionId=${sid}`, { method: "DELETE" })
      if (sessionId === sid) newChat()
      setSessions((prev) => prev.filter((s) => s.id !== sid))
    } catch {
      /* silent */
    }
    setOpenMenuId(null)
  }

  async function pinSession(sid: string, currentPinned: boolean) {
    try {
      await fetch("/api/chat/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, pinned: !currentPinned }),
      })
      setSessions((prev) =>
        prev
          .map((s) => (s.id === sid ? { ...s, pinned: !currentPinned } : s))
          .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1
            if (!a.pinned && b.pinned) return 1
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          }),
      )
    } catch {
      /* silent */
    }
    setOpenMenuId(null)
  }

  function shareSession(sid: string) {
    const url = `${window.location.origin}/chat?session=${sid}`
    navigator.clipboard.writeText(url).then(() => {
      alert("Chat link copied to clipboard!")
    }).catch(() => {
      alert("Link: " + url)
    })
    setOpenMenuId(null)
  }

  const lastAssistantEmpty =
    messages[messages.length - 1]?.role === "assistant" &&
    messages[messages.length - 1].content === ""
  const showTyping = isStreaming && lastAssistantEmpty
  const streamingNow = isStreaming && !lastAssistantEmpty
  const canSend = !isStreaming && input.trim().length > 0

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-card shadow-float transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="font-heading text-base font-medium text-foreground">Chat History</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close chat history"
            className="grid size-8 place-items-center rounded-full text-faint transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3">
          <button
            onClick={newChat}
            className="flex w-full items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-left text-sm text-foreground transition-colors duration-200 hover:border-sage hover:bg-sage-soft"
          >
            <PenLine className="size-4 text-sage-strong" /> New Conversation
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {sessions.length === 0 ? (
            <div className="mt-8 text-center text-xs text-faint">
              No conversations yet
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Pinned sessions first */}
              {sessions.some((s) => s.pinned) && (
                <p className="mb-1 flex items-center gap-1 px-1 text-[11px] font-semibold tracking-widest text-sage-strong uppercase">
                  <Pin className="size-3" /> Pinned
                </p>
              )}
              {sessions
                .sort((a, b) => {
                  if (a.pinned && !b.pinned) return -1
                  if (!a.pinned && b.pinned) return 1
                  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                })
                .map((s) => (
                  <div
                    key={s.id}
                    className={`group relative w-full rounded-2xl transition-colors duration-200 hover:bg-muted ${
                      sessionId === s.id
                        ? "border border-sage/50 bg-sage-soft"
                        : "border border-transparent"
                    }`}
                  >
                    {/* Session button */}
                    <button
                      onClick={() => loadSession(s.id)}
                      disabled={loadingSession}
                      className="w-full rounded-2xl px-3 py-2.5 pr-9 text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-1.5">
                        {s.pinned && (
                          <Pin className="size-3 text-sage-strong" />
                        )}
                        <p className="flex-1 truncate text-sm text-foreground">
                          {s.title && s.title !== "New Conversation" ? s.title : "New Conversation"}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[11px] text-faint">
                        {new Date(s.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>

                    {/* 3-dot menu button, visible on hover or when the menu is open */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(openMenuId === s.id ? null : s.id)
                      }}
                      aria-label="Conversation options"
                      className={`absolute top-2.5 right-2 rounded-lg p-1 text-faint transition-opacity hover:bg-card hover:text-foreground focus-visible:opacity-100 ${
                        openMenuId === s.id ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      }`}
                    >
                      <MoreHorizontal className="size-4" />
                    </button>

                    {/* Dropdown menu */}
                    {openMenuId === s.id && (
                      <div className="absolute top-9 right-2 z-50 min-w-[150px] overflow-hidden rounded-2xl border border-border bg-popover py-1 shadow-lift">
                        <button
                          onClick={() => pinSession(s.id, s.pinned)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-foreground transition-colors hover:bg-muted"
                        >
                          <Pin className="size-3.5" />
                          {s.pinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                          onClick={() => shareSession(s.id)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-foreground transition-colors hover:bg-muted"
                        >
                          <Link2 className="size-3.5" />
                          Share
                        </button>
                        <div className="my-1 border-t border-border" />
                        <button
                          onClick={() => deleteSession(s.id)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-destructive transition-colors hover:bg-destructive-soft"
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .solace-msg { animation: msgIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <GardenBackdrop />

      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-line-strong hover:text-foreground"
              aria-label="Chat history"
            >
              <PanelLeft className="size-4" />
            </button>
            <Link
              href="/"
              aria-label="Back to home"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-line-strong hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <LogoMark className="ml-1 size-9" />
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-2">
                <p className="truncate font-heading text-lg font-medium text-foreground">Solace</p>
                <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-sage-strong">
                  <span className="size-1.5 rounded-full bg-sage animate-breathe" />
                  online
                </span>
              </div>
              <p className="truncate text-xs text-faint">
                AI Mental Health Support
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/mood"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:border-line-strong hover:text-foreground sm:inline-flex"
            >
              <SmilePlus className="size-3.5 text-clay-strong" /> Mood
            </Link>
            <Link
              href="/journal"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:border-line-strong hover:text-foreground sm:inline-flex"
            >
              <NotebookPen className="size-3.5 text-sage-strong" /> Journal
            </Link>
            <button
              onClick={newChat}
              disabled={isStreaming}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              New Chat
            </button>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 pt-24 pb-48 sm:pb-40"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          {showCrisisBanner && (
            <div role="alert" className="mx-auto mb-2 w-full max-w-3xl rounded-3xl border border-clay/40 bg-clay-soft px-5 py-4 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <LifeBuoy className="mt-0.5 size-5 shrink-0 text-clay-strong" />
                  <div>
                    <p className="text-sm font-semibold text-clay-strong">
                      🆘 You&apos;re not alone, and help is available right now
                    </p>
                    <p className="mt-1 text-xs text-foreground/80">
                      If you&apos;re in crisis, please contact one of these helplines:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href="tel:988"
                        className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft transition-colors hover:bg-background"
                      >
                        📞 988 Suicide & Crisis Lifeline (US)
                      </a>
                      <a
                        href="https://www.befrienders.org"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft transition-colors hover:bg-background"
                      >
                        🌍 International: befrienders.org
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCrisisBanner(false)}
                  aria-label="Dismiss"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-clay-strong/70 transition-colors hover:bg-card hover:text-clay-strong"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}
          {messages.length === 0 ? (
            <div className="animate-rise flex flex-col items-center justify-center pt-12 text-center sm:pt-16">
              <GardenNook />
              <h1 className="mt-6 font-heading text-3xl font-normal text-foreground sm:text-4xl">
                How are you feeling today?
              </h1>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                I&apos;m here to listen. Start wherever you like, or pick one of these:
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                {SUGGESTIONS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChip(chip)}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-sage hover:bg-sage-soft"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="solace-msg flex justify-end">
                  <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground sm:max-w-[75%]">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="solace-msg flex items-start gap-3">
                  <LogoMark className="mt-1 size-8" />
                  <div
                    className={`max-w-[85%] rounded-3xl rounded-tl-md border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-soft sm:max-w-[75%] ${
                      m.content === ERROR_MESSAGE
                        ? "border-destructive/30 bg-destructive-soft text-destructive"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    {m.content}
                    {streamingNow && i === messages.length - 1 && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-sage align-middle" />
                    )}
                  </div>
                </div>
              ),
            )
          )}

          {showTyping && (
            <div className="solace-msg flex items-start gap-3" aria-label="Solace is typing">
              <LogoMark className="mt-1 size-8" />
              <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-md border border-border bg-card px-4 py-4 shadow-soft">
                <span className="animate-dot size-2 rounded-full bg-sage [animation-delay:0ms]" />
                <span className="animate-dot size-2 rounded-full bg-sage [animation-delay:180ms]" />
                <span className="animate-dot size-2 rounded-full bg-sage [animation-delay:360ms]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/90 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="flex min-w-16 flex-col items-center gap-1 rounded-2xl bg-sage-soft px-3 py-1.5 text-sage-strong">
          <MessageSquare className="size-5" strokeWidth={1.75} />
          <span className="text-[11px] font-medium">Chat</span>
        </div>
        <Link
          href="/mood"
          className="flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-faint transition-colors hover:text-foreground"
        >
          <SmilePlus className="size-5" strokeWidth={1.75} />
          <span className="text-[11px] font-medium">Mood</span>
        </Link>
        <Link
          href="/journal"
          className="flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-faint transition-colors hover:text-foreground"
        >
          <NotebookPen className="size-5" strokeWidth={1.75} />
          <span className="text-[11px] font-medium">Journal</span>
        </Link>
        <button
          onClick={newChat}
          className="flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-faint transition-colors hover:text-foreground"
        >
          <Plus className="size-5" strokeWidth={1.75} />
          <span className="text-[11px] font-medium">New</span>
        </button>
      </nav>

      <footer className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/90 backdrop-blur-md sm:bottom-0">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2.5 px-4 pt-3 pb-3 sm:pt-4 sm:pb-4">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              autoResize()
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Share what's on your mind..."
            disabled={isStreaming}
            aria-label="Message"
            className="max-h-28 flex-1 resize-none rounded-3xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-faint shadow-soft outline-none transition-colors duration-300 focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!canSend}
            aria-label="Send message"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal className="size-4" />
          </button>
        </div>
      </footer>
    </div>
  )
}
