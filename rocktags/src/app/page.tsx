import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
    </main>
  )
}