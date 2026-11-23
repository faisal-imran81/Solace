"use client"

import { motion } from "framer-motion"
import {
  MessageCircleHeart,
  SmilePlus,
  NotebookPen,
  LockKeyhole,
  LifeBuoy,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react"
import { SectionLabel } from "./SectionLabel"

const features: { icon: LucideIcon; title: string; description: string; tone?: "clay" }[] = [
  {
    icon: MessageCircleHeart,
    title: "Chat any time",
    description:
      "Talk to Solace day or night. It listens, replies without judgment and can suggest ways to cope. It won't diagnose you or replace a therapist.",
  },
  {
    icon: SmilePlus,
    title: "Mood tracking",
    description:
      "Pick one of five moods, add a note if you like, and see your last seven days on a simple chart.",
  },
  {
    icon: NotebookPen,
    title: "Private journal",
    description:
      "Write as much or as little as you want. When you save, Solace notes the overall tone and replies with a short reflection and a question to think about.",
  },
  {
    icon: LockKeyhole,
    title: "Private to you",
    description: "Your chats, journal entries and mood history are tied to your account. Nobody else can see them.",
  },
  {
    icon: LifeBuoy,
    title: "Help when it's serious",
    tone: "clay",
    description:
      "If you mention suicide or self-harm in a chat, Solace shows crisis helplines straight away: 988 in the US and befrienders.org everywhere else.",
  },
  {
    icon: MonitorSmartphone,
    title: "Use it anywhere",
    description:
      "Solace runs in your browser on your phone or laptop. There's nothing to install.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 px-5 py-24 sm:py-28">
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionLabel>Features</SectionLabel>
          <h2 className="mt-4 font-heading text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
            What you can do in Solace
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Chat, journal, log your mood or take a few slow breaths. It&apos;s all
            in one place.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="surface group relative rounded-3xl p-7 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span
                className={`inline-grid size-12 place-items-center rounded-[45%_55%_50%_50%/55%_45%_55%_45%] transition-[border-radius] duration-700 group-hover:rounded-[55%_45%_45%_55%/45%_55%_45%_55%] ${
                  feature.tone === "clay"
                    ? "bg-clay-soft text-clay-strong"
                    : "bg-sage-soft text-sage-strong"
                }`}
              >
                <feature.icon className="size-5" strokeWidth={1.75} />
              </span>

              <h3 className="mt-5 font-heading text-xl font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
