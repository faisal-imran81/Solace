"use client"

import { motion } from "framer-motion"
import {
  Brain,
  BarChart2,
  BookOpen,
  Shield,
  Zap,
  Globe,
  type LucideIcon,
} from "lucide-react"

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Brain,
    title: "Chat any time",
    description:
      "Talk to Solace day or night. It listens, replies without judgment and can suggest ways to cope. It won't diagnose you or replace a therapist.",
  },
  {
    icon: BarChart2,
    title: "Mood tracking",
    description:
      "Pick one of five moods, add a note if you like, and see your last seven days on a simple chart.",
  },
  {
    icon: BookOpen,
    title: "Private journal",
    description:
      "Write as much or as little as you want. When you save, Solace notes the overall tone and replies with a short reflection and a question to think about.",
  },
  {
    icon: Shield,
    title: "Private to you",
    description: "Your chats, journal entries and mood history are tied to your account. Nobody else can see them.",
  },
  {
    icon: Zap,
    title: "Help when it's serious",
    description:
      "If you mention suicide or self-harm in a chat, Solace shows crisis helplines straight away: 988 in the US and befrienders.org everywhere else.",
  },
  {
    icon: Globe,
    title: "Use it anywhere",
    description:
      "Solace runs in your browser on your phone or laptop. There's nothing to install.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 px-4 py-28">
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            What you can do in Solace
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Chat, journal, log your mood or take a few slow breaths. It&apos;s all
            in one place.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(300px_at_50%_0%,rgba(139,92,246,0.15),transparent_70%)]" />
              </div>

              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2 }}
                className="relative inline-grid size-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25"
              >
                <feature.icon className="size-6 text-white" />
              </motion.div>

              <h3 className="relative mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
