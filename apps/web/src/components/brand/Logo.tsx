import { cn } from "@/lib/utils"

/** Solace mark: a smooth pebble holding a single leaf. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9 shrink-0", className)} aria-hidden>
      <path
        d="M20.4 3.2c9.4.2 16.6 7 16.4 16.6-.2 10-7.6 17-17.4 17C9.6 36.8 3 30 3.2 20.6 3.4 10.6 11 3 20.4 3.2Z"
        className="fill-sage-soft stroke-sage/40"
        strokeWidth="1"
      />
      <path
        d="M12.5 27.5c-.6-8.2 5-14.6 15.6-15.6.8 9.4-4.8 15.8-14 16.4"
        className="fill-sage"
      />
      <path
        d="M11.6 29.4c3-4.6 7.2-8.8 12.6-12"
        className="stroke-primary"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string
  markClassName?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="font-heading text-xl font-medium tracking-tight text-foreground">
        Solace
      </span>
    </span>
  )
}
