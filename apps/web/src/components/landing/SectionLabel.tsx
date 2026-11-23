import type { ReactNode } from "react"

/** Small eyebrow label with a leaf, used above landing section headings. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-sage-strong uppercase">
      <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
        <path d="M2.5 13.5C2.5 6.8 6.6 2.6 13.5 2.5c0 6.9-4.2 11-11 11Z" className="fill-sage" />
        <path d="M2.5 13.5 9.5 6.5" className="stroke-primary" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
      {children}
    </span>
  )
}
