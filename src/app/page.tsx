import HeroSection from '@/components/HeroSection'
import Features    from '@/components/Features'
import Footer      from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroSection />
      <Features />
      <Footer />
    </main>
  )
}
