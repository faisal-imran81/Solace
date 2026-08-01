import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Impact } from "@/components/landing/Impact"
import { Testimonials } from "@/components/landing/Testimonials"
import { CTA } from "@/components/landing/CTA"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <div className="dark scroll-smooth overflow-x-hidden bg-[#0a0a0f] text-white antialiased">
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
    </div>
  )
}
