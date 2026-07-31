"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

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

const GROQ_API_URL = "http://localhost:8000/api/v1/chat/"

const PARTICLES = [
  { top: "14%", left: "8%", size: 5, delay: 0, color: "rgba(34,211,238,0.7)" },
  { top: "28%", left: "88%", size: 4, delay: 0.6, color: "rgba(217,70,239,0.6)" },
  { top: "58%", left: "5%", size: 6, delay: 1.2, color: "rgba(139,92,246,0.7)" },
  { top: "72%", left: "92%", size: 3, delay: 0.3, color: "rgba(34,211,238,0.6)" },
  { top: "44%", left: "95%", size: 4, delay: 0.9, color: "rgba(139,92,246,0.6)" },
  { top: "84%", left: "38%", size: 3, delay: 1.5, color: "rgba(34,211,238,0.6)" },
  { top: "36%", left: "3%", size: 3, delay: 2.1, color: "rgba(217,70,239,0.5)" },
]

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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0d0d0d] text-white">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
              <svg viewBox="0 0 24 24" className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-white">Chat History</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-xl leading-none text-white/40 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3">
          <button
            onClick={newChat}
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-left text-sm text-white/70 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
          >
            <span className="text-lg">✏️</span> New Conversation
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {sessions.length === 0 ? (
            <div className="mt-8 text-center text-xs text-white/30">
              No previous conversations yet
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Pinned sessions first */}
              {sessions.some((s) => s.pinned) && (
                <p className="mb-1 px-1 text-[10px] font-medium tracking-widest text-violet-400/60 uppercase">
                  📌 Pinned
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
                    className={`group relative w-full rounded-xl transition-all duration-200 hover:bg-white/[0.06] ${
                      sessionId === s.id
                        ? "border border-violet-500/40 bg-violet-500/10"
                        : "border border-transparent"
                    }`}
                  >
                    {/* Session button */}
                    <button
                      onClick={() => loadSession(s.id)}
                      disabled={loadingSession}
                      className="w-full px-3 py-2.5 text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-1.5">
                        {s.pinned && (
                          <span className="text-[10px] text-violet-400">📌</span>
                        )}
                        <p className="flex-1 truncate text-sm text-white/80">
                          {s.title && s.title !== "New Conversation" ? s.title : "New Conversation"}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[10px] text-white/30">
                        {new Date(s.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>

                    {/* 3-dot menu button — visible on hover or when menu open */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(openMenuId === s.id ? null : s.id)
                      }}
                      className={`absolute top-2.5 right-2 rounded-lg p-1 text-white/40 transition-all hover:bg-white/10 hover:text-white ${
                        openMenuId === s.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
                        <circle cx="5" cy="12" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="19" cy="12" r="1.5" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {openMenuId === s.id && (
                      <div className="absolute top-8 right-2 z-50 min-w-[140px] overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e] shadow-2xl shadow-black/60 backdrop-blur-xl">
                        <button
                          onClick={() => pinSession(s.id, s.pinned)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <span>📌</span>
                          {s.pinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                          onClick={() => shareSession(s.id)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <span>🔗</span>
                          Share
                        </button>
                        <div className="border-t border-white/10" />
                        <button
                          onClick={() => deleteSession(s.id)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-rose-400 transition-colors hover:bg-rose-500/10"
                        >
                          <span>🗑️</span>
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
        @keyframes particleFloat {
          0%, 100% { transform: translateY(-8px); opacity: 0.25; }
          50% { transform: translateY(8px); opacity: 1; }
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.08); }
          66% { transform: translate(-30px, -20px) scale(0.95); }
        }
        @keyframes blobPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.9; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .solace-msg { animation: msgIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .solace-particle {
          animation: particleFloat 5s ease-in-out infinite;
        }
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
        style={{ animation: "blobPulse 8s ease-in-out infinite" }}
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
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-full border border-white/15 bg-white/[0.04] p-2 text-white/60 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
              aria-label="Chat history"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="15" y2="18" />
              </svg>
            </button>
            <Link
              href="/"
              aria-label="Back to home"
              className="rounded-full border border-white/15 bg-white/[0.04] p-2 text-white/60 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
            >
              <span aria-hidden>←</span>
            </Link>
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30">
              <svg
                viewBox="0 0 24 24"
                className="size-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-white">Solace</p>
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                  online
                </span>
              </div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
                AI Mental Health Support
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/mood"
              className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
            >
              📊 Mood
            </Link>
            <Link
              href="/journal"
              className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white"
            >
              📝 Journal
            </Link>
            <button
              onClick={newChat}
              disabled={isStreaming}
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              New Chat
            </button>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 pt-24 pb-40"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {showCrisisBanner && (
            <div className="mx-auto mb-4 w-full max-w-3xl rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-rose-400">
                    🆘 You&apos;re not alone — immediate help is available
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    If you&apos;re in crisis, please reach out to a helpline right now:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <a
                      href="tel:988"
                      className="text-xs font-medium text-cyan-400 hover:underline"
                    >
                      📞 988 Suicide & Crisis Lifeline (US)
                    </a>
                    <a
                      href="https://www.befrienders.org"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-cyan-400 hover:underline"
                    >
                      🌍 International: befrienders.org
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setShowCrisisBanner(false)}
                  className="shrink-0 text-lg leading-none text-white/40 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <div className="relative">
                <div className="absolute inset-0 -z-10 size-16 rounded-2xl bg-violet-500/30 blur-2xl" />
                <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-xl shadow-violet-500/30">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                </span>
              </div>
              <h1 className="mt-6 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                How are you feeling today?
              </h1>
              <p className="mt-3 text-sm text-white/60">
                I&apos;m here to listen, support, and guide you.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {SUGGESTIONS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChip(chip)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
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
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm text-white shadow-lg shadow-violet-500/20">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="solace-msg flex items-start gap-3">
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
                    S
                  </span>
                  <div
                    className={`max-w-[75%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed backdrop-blur-xl ${
                      m.content === ERROR_MESSAGE ? "text-rose-400" : "text-white/90"
                    }`}
                  >
                    {m.content}
                    {streamingNow && i === messages.length - 1 && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-cyan-400 align-middle" />
                    )}
                  </div>
                </div>
              ),
            )
          )}

          {showTyping && (
            <div className="solace-msg flex items-start gap-3">
              <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
                S
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-xl">
                <span className="size-2 animate-bounce rounded-full bg-violet-500 [animation-delay:0ms]" />
                <span className="size-2 animate-bounce rounded-full bg-fuchsia-500 [animation-delay:150ms]" />
                <span className="size-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-3 px-4 py-4">
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
            className="max-h-28 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/90 placeholder:text-white/40 backdrop-blur-xl outline-none transition-all duration-300 focus:border-white/20 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!canSend}
            aria-label="Send message"
            className="shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}
