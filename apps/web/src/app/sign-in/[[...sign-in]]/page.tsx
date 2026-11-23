import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { GardenBackdrop } from '@/components/brand/Garden'

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-x-hidden bg-background px-4 py-12">
      <GardenBackdrop />
      <Link href="/" aria-label="Solace home" className="relative z-10 rounded-full">
        <Logo />
      </Link>
      <div className="relative z-10">
        <SignIn />
      </div>
    </div>
  )
}
