'use client'

import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion'
import { InteractiveRobotSpline } from '@/components/interactive-3d-robot'
import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

/* ── 5 Products that orbit the robot ── */
const PRODUCTS = [
  { name: 'Read & Answer Agent', symbol: '◉', color: '#06b6d4', bg: '#042a33', slug: 'read-answer-agent', label: 'AI Soru-Cevap' },
  { name: 'Worker Agent',        symbol: '⚙', color: '#3b82f6', bg: '#0f1b3d', slug: 'worker-agent',      label: 'Aktif Asistan' },
  { name: 'Reporter Agent',      symbol: '◈', color: '#8b5cf6', bg: '#1a0f3d', slug: 'reporter-agent',    label: 'Raporlama' },
  { name: 'RPA',                 symbol: '⬡', color: '#f59e0b', bg: '#2a1500', slug: 'rpa',               label: 'Süreç Otomasyonu' },
  { name: 'AI Automations',      symbol: '⚡', color: '#4ade80', bg: '#0a2010', slug: 'ai-automations',   label: 'n8n Entegrasyon' },
]

const ORBIT_RADIUS   = 240
const ORBIT_DURATION = 30000

/* ── Individual orbiting product icon ── */
function OrbitIcon({ product, index, total }: {
  product: typeof PRODUCTS[0]
  index: number
  total: number
}) {
  const x = useMotionValue(Math.cos((2 * Math.PI * index) / total) * ORBIT_RADIUS)
  const y = useMotionValue(Math.sin((2 * Math.PI * index) / total) * ORBIT_RADIUS)

  useAnimationFrame((t) => {
    const angle     = (t / ORBIT_DURATION) * Math.PI * 2
    const iconAngle = angle + (2 * Math.PI * index) / total
    x.set(Math.cos(iconAngle) * ORBIT_RADIUS)
    y.set(Math.sin(iconAngle) * ORBIT_RADIUS)
  })

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ x, y }}
      whileHover={{ scale: 1.3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Link href={`/products/${product.slug}`} className="group flex flex-col items-center gap-1.5">
        <motion.div
          className="w-13 h-13 rounded-xl flex items-center justify-center text-lg font-bold backdrop-blur-md border border-white/10 group-hover:border-white/30 shadow-lg transition-colors duration-300"
          style={{
            width: 52, height: 52,
            background: product.bg,
            color: product.color,
            boxShadow: `0 0 20px ${product.color}30, 0 4px 20px rgba(0,0,0,0.6)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
        >
          {product.symbol}
        </motion.div>
        <span
          className="text-[10px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 text-white/35 group-hover:text-white/70"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
        >
          {product.name}
        </span>
      </Link>
    </motion.div>
  )
}

/* ── Background particles ── */
function Particles() {
  const [dots] = useState(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id:    i,
      x:     Math.random() * 100,
      y:     Math.random() * 100,
      size:  Math.random() * 1.5 + 0.4,
      delay: Math.random() * 6,
      dur:   Math.random() * 4 + 4,
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -18, 0], opacity: [0.1, 0.45, 0.1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Hero Section ── */
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), { stiffness: 80, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-6, 6]), { stiffness: 80, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top  - rect.height / 2)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Particles />

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Robot + Orbit area ── */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{ width: 580, height: 560 }}
      >
        {/* Orbit ring */}
        <div
          className="absolute rounded-full border border-dashed border-white/[0.07] pointer-events-none"
          style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
        />

        {/* Product icons */}
        {PRODUCTS.map((product, i) => (
          <OrbitIcon key={product.slug} product={product} index={i} total={PRODUCTS.length} />
        ))}

        {/* Robot */}
        <motion.div
          className="relative z-10"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
        >
          <div
            className="absolute -inset-6 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(6,182,212,0.14) 0%, transparent 65%)',
              filter: 'blur(14px)',
            }}
          />
          <div className="relative" style={{ width: 380, height: 380 }}>
            <InteractiveRobotSpline
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>

      {/* ── Text content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 -mt-6 max-w-3xl">
        {/* Badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs text-cyan-400/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Yapay Zeka Destekli SaaS Platformu
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          <span className="gradient-text">SaaS Çözümlerini</span>
          <br />
          <span className="text-white/90">Yapay Zeka ile</span>
          <br />
          <span className="gradient-text">Yeniden Tanımlayın.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg text-white/45 max-w-2xl leading-relaxed mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          5 güçlü AI ajanı ve otomasyon çözümüyle işletmenizi dönüştürün.
          <br />
          <span className="text-white/30 text-base">İkona tıklayarak ürünleri keşfedin.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          <motion.button
            className="glow-border group inline-flex items-center gap-2 rounded-xl bg-black px-7 py-3.5 text-sm font-semibold text-white"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Hemen Başlayın
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <motion.button
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Demo İzle
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-[10px] text-white/25 tracking-widest uppercase">Keşfet</span>
        <motion.div
          className="w-px h-8 bg-linear-to-b from-white/25 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
