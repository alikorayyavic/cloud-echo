import Navbar                from '@/components/Navbar'
import HeroSection            from '@/components/HeroSection'
import Stats                  from '@/components/Stats'
import Features               from '@/components/Features'
import RPASection             from '@/components/RPASection'
import AIAutomationsSection   from '@/components/AIAutomationsSection'
import CTABanner              from '@/components/CTABanner'
import Footer                 from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <HeroSection />
      <Stats />
      <Features />
      <RPASection />
      <AIAutomationsSection />
      <CTABanner />
      <Footer />
    </main>
  )
}
