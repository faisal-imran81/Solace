import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Impact } from "@/components/landing/Impact"
import { Testimonials } from "@/components/landing/Testimonials"
import { CTA } from "@/components/landing/CTA"
import { Footer } from "@/components/landing/Footer"
import { MobileNav } from "@/components/landing/MobileNav"

export default function Home() {
  return (
    <div className="dark scroll-smooth overflow-x-hidden bg-[#0a0a0f] text-white antialiased pb-16 sm:pb-0">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Impact />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
