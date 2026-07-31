import { Brain } from "lucide-react"

const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <span className="flex items-center gap-2 text-base font-semibold text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
              <Brain className="size-4" />
            </span>
            Solace
          </span>
          <p className="text-xs text-white/40">
            AI-powered mental wellness for everyone.
          </p>
        </div>

        <div className="flex items-center gap-8 text-sm text-white/50">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Solace. Made with care for every human on
        earth.
      </p>
    </footer>
  )
}
