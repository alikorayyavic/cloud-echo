'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export default function CTABanner() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative bg-black py-28 px-6 overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
      />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width:      900,
          height:     450,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.09) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
          filter:     'blur(60px)',
        }}
      />

      {/* Shimmer border box */}
      <div className="relative mx-auto max-w-3xl">
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(59,130,246,0.08), transparent 60%)',
          }}
        />
        <div className="relative rounded-3xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm px-8 py-16 text-center">

          <motion.div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Ücretsiz başlayın · Kredi kartı gerekmez
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="gradient-text">Yapay Zeka Asistanınızı</span>
            <br />
            <span className="text-white/90">Hemen Oluşturun.</span>
          </motion.h2>

          <motion.p
            className="text-white/40 mb-10 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            5 dakikada kurulum. Sonuçları anında görün.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            <motion.a
              href="/try-it"
              className="glow-border group relative inline-flex items-center gap-2.5 rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.08))' }}
              />
              <span className="relative">Ücretsiz Deneyin</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.a>

            <motion.button
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white/55 hover:text-white hover:bg-white/10 transition-colors duration-200"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Satışla Görüş
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
