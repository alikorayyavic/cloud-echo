'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Cpu, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const PRODUCTS = [
  {
    icon:     MessageSquare,
    title:    'Read & Answer Agent',
    desc:     'Veritabanı ve LLM entegrasyonuyla şirket verilerinize doğal dil sorgusu yapın. Anlık, doğru ve bağlamsal yanıtlar alın.',
    color:    '#06b6d4',
    gradient: 'from-cyan-500/10 to-transparent',
    slug:     'read-answer-agent',
    tag:      'Soru-Cevap',
  },
  {
    icon:     Cpu,
    title:    'Worker Agent',
    desc:     'Güvenli yetki yapısıyla güncelleme, silme ve oluşturma işlemlerini otomatikleştiren aktif AI asistanı.',
    color:    '#3b82f6',
    gradient: 'from-blue-500/10 to-transparent',
    slug:     'worker-agent',
    tag:      'Aktif Ajan',
  },
  {
    icon:     BarChart3,
    title:    'Reporter Agent',
    desc:     'İş Zekası ve veritabanı kaynaklarından otomatik rapor ve analiz üretimi. Anlık içgörüler.',
    color:    '#8b5cf6',
    gradient: 'from-violet-500/10 to-transparent',
    slug:     'reporter-agent',
    tag:      'Raporlama',
  },
]

function ProductCard({ product, index, wide }: { product: typeof PRODUCTS[0]; index: number; wide?: boolean }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon   = product.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={wide ? 'col-span-1 sm:col-span-1' : ''}
    >
      <Link href={`/products/${product.slug}`} className="group block h-full">
        <div className="relative h-full rounded-2xl border border-slate-200 bg-slate-50 p-7 backdrop-blur-sm overflow-hidden cursor-pointer">
          {/* Gradient fill on hover */}
          <div
            className={`absolute inset-0 bg-linear-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
          />

          {/* Border glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `inset 0 0 0 1px ${product.color}50, 0 0 30px ${product.color}15` }}
          />

          {/* Tag */}
          <div className="mb-5 flex items-start justify-between">
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
              style={{
                background:  `linear-gradient(135deg, ${product.color}20, ${product.color}08)`,
                boxShadow:   `0 0 18px ${product.color}20`,
              }}
            >
              <Icon className="h-5 w-5" style={{ color: product.color }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
              style={{ color: product.color, borderColor: `${product.color}30`, background: `${product.color}10` }}
            >
              {product.tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2.5 text-xl font-semibold text-slate-900 tracking-tight transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-base text-slate-400 leading-relaxed mb-5 transition-colors">
            {product.desc}
          </p>

          {/* CTA */}
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 group-hover:gap-2.5"
            style={{ color: product.color }}
          >
            Keşfet
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>

          {/* Bottom accent */}
          <div
            className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${product.color}50, transparent)` }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

export default function Features() {
  const headingRef    = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-80px' })

  return (
    <section className="relative bg-white py-28 px-6 overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent)' }}
      />

      {/* Section glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width:      700,
          height:     350,
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)',
          filter:     'blur(40px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 text-center">
          <motion.div
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs text-slate-500"
            initial={{ opacity: 0, y: 12 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            3 AI Ajan
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <span className="gradient-text">AI Ajan</span> Çözümleri
          </motion.h2>

          <motion.p
            className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Soru-cevap ajanından tam otomasyon çözümlerine — tek platformda tüm AI ihtiyaçlarınız.
          </motion.p>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
