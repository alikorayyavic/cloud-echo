'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const STATS = [
  { value: '500+', label: 'Mutlu Müşteri' },
  { value: '%80',  label: 'Zaman Tasarrufu' },
  { value: '5',    label: 'AI Ürünü' },
  { value: '7/24', label: 'Kesintisiz Destek' },
]

export default function Stats() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative bg-black px-6 py-4">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />

      <div ref={ref} className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06] rounded-2xl border border-white/[0.06] overflow-hidden">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 px-8 py-10 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-xs text-white/35 tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
      />
    </section>
  )
}
