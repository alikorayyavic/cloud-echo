'use client'

import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion'
import { InteractiveRobotSpline } from '@/components/interactive-3d-robot'
import { useRef, useState } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

/* ── 5 Products that orbit the robot ── */
const PRODUCTS = [
  { name: 'Read & Answer Agent', symbol: '◉', color: '#06b6d4', bg: '#042a33', slug: 'read-answer-agent' },
  { name: 'Worker Agent',        symbol: '⚙', color: '#3b82f6', bg: '#0f1b3d', slug: 'worker-agent'      },
  { name: 'Reporter Agent',      symbol: '◈', color: '#8b5cf6', bg: '#1a0f3d', slug: 'reporter-agent'    },
  { name: 'RPA',                 symbol: '⬡', color: '#f59e0b', bg: '#2a1500', slug: 'rpa'               },
  { name: 'AI Automations',      symbol: '⚡', color: '#4ade80', bg: '#0a2010', slug: 'ai-automations'   },
]

const ORBIT_RADIUS   = 210
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
          className="rounded-xl flex items-center justify-center text-base font-bold backdrop-blur-md border border-white/10 group-hover:border-white/30 shadow-lg transition-colors duration-300"
          style={{
            width: 48, height: 48,
            background: product.bg,
            color:      product.color,
            boxShadow:  `0 0 20px ${product.color}30, 0 4px 20px rgba(0,0,0,0.6)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
        >
          {product.symbol}
        </motion.div>
        <span
          className="text-[9px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 text-white/35 group-hover:text-white/70"
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
    Array.from({ length: 40 }, (_, i) => ({
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
      className="relative min-h-screen flex items-center overflow-hidden bg-black pt-16"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Particles />

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width:      900,
          height:     900,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.07) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
          top:        '50%',
          left:       '60%',
          transform:  'translate(-50%, -50%)',
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

      <div className="relative z-10 mx-auto max-w-6xl px-6 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Text content ── */}
          <div className="flex flex-col items-start">

            {/* Badge */}
            <motion.div
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs text-cyan-400/80 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Yapay Zeka Destekli SaaS Platformu
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <span className="gradient-text">SaaS Çözümlerini</span>
              <br />
              <span className="text-white/90">Yapay Zeka ile</span>
              <br />
              <span className="gradient-text">Yeniden Tanımlayın.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-base md:text-lg text-white/42 leading-relaxed mb-9 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              5 güçlü AI ajanı ve otomasyon çözümüyle işletmenizi dönüştürün.
              İkona tıklayarak ürünleri keşfedin.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
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
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/55 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Demo İzle
              </motion.button>
            </motion.div>

            {/* Social proof mini */}
            <motion.div
              className="mt-9 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="flex -space-x-2">
                {['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b'].map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-black"
                    style={{ background: `radial-gradient(circle at 40% 40%, ${color}cc, ${color}66)` }}
                  />
                ))}
              </div>
              <p className="text-xs text-white/35">
                <span className="text-white/60 font-semibold">500+</span> işletme zaten kullanıyor
              </p>
            </motion.div>
          </div>

          {/* ── Right: Robot + Orbit ── */}
          <div
            ref={containerRef}
            className="relative flex items-center justify-center"
            style={{ height: 500 }}
          >
            {/* Orbit ring */}
            <div
              className="absolute rounded-full border border-dashed border-white/[0.07] pointer-events-none"
              style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
            />

            {/* Second subtle ring */}
            <div
              className="absolute rounded-full border border-white/[0.03] pointer-events-none"
              style={{ width: ORBIT_RADIUS * 2 + 60, height: ORBIT_RADIUS * 2 + 60 }}
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
                className="absolute -inset-8 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(6,182,212,0.14) 0%, transparent 65%)',
                  filter:     'blur(16px)',
                }}
              />
              <div className="relative" style={{ width: 340, height: 340 }}>
                <InteractiveRobotSpline
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-[10px] text-white/20 tracking-widest uppercase">Keşfet</span>
        <motion.div
          className="w-px h-8 bg-linear-to-b from-white/20 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
