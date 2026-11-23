import { useId, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

/** An almond-shaped leaf, drawn from the origin along the x axis. */
function leaf(len: number, width = 0.32) {
  const w = len * width
  return `M0 0 C ${len * 0.3} ${-w}, ${len * 0.72} ${-w}, ${len} 0 C ${len * 0.72} ${w}, ${len * 0.3} ${w}, 0 0 Z`
}

type LeafSpec = [x: number, y: number, angle: number, len: number]

function Sprig({
  stem,
  leaves,
  className,
  style,
}: {
  stem: string
  leaves: LeafSpec[]
  className?: string
  style?: CSSProperties
}) {
  return (
    <g className={className} style={style}>
      <path d={stem} className="stroke-primary" strokeWidth="2" strokeLinecap="round" fill="none" />
      {leaves.map(([x, y, a, l], i) => (
        <path
          key={i}
          d={leaf(l)}
          transform={`translate(${x} ${y}) rotate(${a})`}
          className={i % 3 === 1 ? "fill-sage-strong/80" : "fill-sage"}
        />
      ))}
    </g>
  )
}

/**
 * The "garden window": an arched opening onto a small, quiet landscape.
 * Used as Solace's signature illustration.
 */
export function GardenWindow({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "")
  const clip = `arch-${id}`

  return (
    <svg
      viewBox="0 0 320 400"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="An arched window looking onto a calm garden with a low sun"
    >
      <defs>
        <clipPath id={clip}>
          <path d="M16 392V168C16 86 80 18 160 18s144 68 144 150v224Z" />
        </clipPath>
      </defs>

      <path
        d="M16 392V168C16 86 80 18 160 18s144 68 144 150v224Z"
        className="fill-sage-soft"
      />

      <g clipPath={`url(#${clip})`}>
        <circle cx="214" cy="126" r="40" className="animate-breathe fill-clay/35" />
        <circle cx="214" cy="126" r="62" className="animate-breathe fill-clay/10" style={{ animationDelay: "-3s" }} />

        <path d="M16 286 C 80 246, 160 262, 304 228 V400 H16Z" className="fill-sage/45" />
        <path d="M16 330 C 104 300, 196 322, 304 292 V400 H16Z" className="fill-sage/75" />
        <path d="M16 368 C 120 346, 220 360, 304 344 V400 H16Z" className="fill-sage-strong/50" />

        <Sprig
          className="animate-sway"
          stem="M108 350 C 104 296, 108 240, 124 178"
          leaves={[
            [107, 318, -150, 26],
            [108, 300, -28, 30],
            [107, 272, -158, 28],
            [110, 252, -34, 30],
            [113, 226, -150, 24],
            [117, 208, -42, 26],
            [124, 178, -76, 22],
          ]}
        />
        <Sprig
          className="animate-sway"
          style={{ animationDelay: "-4s" }}
          stem="M236 360 C 238 324, 232 292, 220 262"
          leaves={[
            [237, 338, -24, 22],
            [236, 322, -160, 22],
            [233, 298, -30, 22],
            [228, 282, -150, 20],
            [220, 262, -110, 18],
          ]}
        />

        <ellipse cx="168" cy="372" rx="22" ry="9" className="fill-card stroke-line-strong" strokeWidth="1.5" />
        <ellipse cx="196" cy="378" rx="12" ry="6" className="fill-card stroke-line-strong" strokeWidth="1.5" />
        <ellipse cx="68" cy="382" rx="16" ry="7" className="fill-card stroke-line-strong" strokeWidth="1.5" />
      </g>

      <path
        d="M16 392V168C16 86 80 18 160 18s144 68 144 150v224"
        className="stroke-line-strong"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

/** A small arch with one sprig, for empty states. */
export function GardenNook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("size-28", className)} aria-hidden>
      <path d="M14 112V58C14 32 34 12 60 12s46 20 46 46v54Z" className="fill-sage-soft" />
      <circle cx="78" cy="46" r="12" className="animate-breathe fill-clay/30" />
      <path d="M14 96 C 44 86, 76 94, 106 84 V112 H14Z" className="fill-sage/50" />
      <Sprig
        className="animate-sway"
        stem="M52 108 C 50 90, 53 72, 60 56"
        leaves={[
          [51, 96, -150, 14],
          [51, 86, -30, 15],
          [53, 74, -152, 14],
          [56, 64, -40, 14],
          [60, 56, -80, 11],
        ]}
      />
      <path d="M14 112V58C14 32 34 12 60 12s46 20 46 46v54" className="stroke-line-strong" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

/** Soft organic shapes that sit behind app pages. */
export function GardenBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 200 200"
        className="animate-drift absolute -top-40 -right-40 w-[30rem] text-sage-soft sm:w-[38rem] dark:opacity-60"
      >
        <path
          fill="currentColor"
          d="M144.5 38.3c16.3 13.6 25.4 37.3 24 59.6-1.4 22.3-13.4 43.2-31.3 55.4-17.9 12.2-41.7 15.7-62.4 9.2-20.7-6.5-38.3-23-44.5-43.1-6.2-20.1-1-43.8 12.5-60.5 13.5-16.7 35.3-26.4 56.4-27.6 21.1-1.2 29 .5 45.3 7Z"
        />
      </svg>
      <svg
        viewBox="0 0 200 200"
        className="animate-drift absolute -bottom-48 -left-40 w-[26rem] text-clay-soft opacity-70 sm:w-[32rem] dark:opacity-30"
        style={{ animationDelay: "-11s" }}
      >
        <path
          fill="currentColor"
          d="M152.4 54.6c14.7 17.4 20.2 42.6 12.3 62.4-7.9 19.8-29.2 34.2-50.8 40.3-21.6 6.1-43.5 3.9-59.4-7.6-15.9-11.5-25.8-32.3-23.4-51.8 2.4-19.5 17.1-37.7 35.4-46.8 18.3-9.1 40.2-9.1 56.6-6.9 16.4 2.2 14.6-7 29.3 10.4Z"
        />
      </svg>
    </div>
  )
}
