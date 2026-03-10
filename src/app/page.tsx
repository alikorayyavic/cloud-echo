import Navbar       from '@/components/Navbar'
import HeroSection  from '@/components/HeroSection'
import Stats        from '@/components/Stats'
import LiveActivity from '@/components/LiveActivity'
import Features     from '@/components/Features'
import CTABanner    from '@/components/CTABanner'
import Footer       from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <HeroSection />
      <Stats />
      <LiveActivity />
      <Features />
      <CTABanner />
      <Footer />
    </main>
  )
}
