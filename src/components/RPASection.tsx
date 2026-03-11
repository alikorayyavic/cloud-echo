'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Bot, CheckCircle2, ArrowRight, FileText, Database, RefreshCw, Clock } from 'lucide-react'
import Link from 'next/link'

const BENEFITS = [
  { icon: CheckCircle2, text: 'İlk yılda %30–200 yatırım getirisi' },
  { icon: Clock,        text: '7/24 kesintisiz, sıfır hata oranıyla çalışma' },
  { icon: RefreshCw,    text: 'Ölçeklenebilir kapasite — ek personel gerekmez' },
  { icon: Database,     text: 'Denetim izi ve tam süreç şeffaflığı' },
]

const USE_CASES = [
  { label: 'Fatura İşleme',    Icon: FileText,   color: '#f59e0b' },
  { label: 'Veri Girişi',      Icon: Database,   color: '#f59e0b' },
  { label: 'ERP Güncellemesi', Icon: RefreshCw,  color: '#f59e0b' },
  { label: 'Stok Takibi',      Icon: Bot,        color: '#f59e0b' },
]

export default function RPASection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative bg-black py-28 px-6 overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />

      {/* Amber background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 500,
          top: '50%', left: '70%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, rgba(245,158,11,0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div>
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs text-amber-400/80"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Bot className="h-3 w-3" />
              Robotik Süreç Otomasyonu
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-white/90">Tekrar Eden İşleri</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Robotlara Bırakın
              </span>
            </motion.h2>

            <motion.p
              className="text-white/40 text-base leading-relaxed mb-8 max-w-md"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              RPA yazılım robotları; form doldurma, veri girişi ve sistem entegrasyonu gibi tekrarlayan görevleri insan müdahalesi olmadan yürütür. Ekibiniz stratejik işlere odaklanırken robotlar hata yapmadan çalışır.
            </motion.p>

            <motion.div
              className="space-y-3 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {BENEFITS.map((b, i) => {
                const Icon = b.icon
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Icon className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <span className="text-sm text-white/60">{b.text}</span>
                  </div>
                )
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/products/rpa"
                  className="group inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/8 px-6 py-3 text-sm font-semibold text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/12 transition-all duration-200"
                >
                  RPA Çözümlerini Keşfet
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
          >
            {/* Main card */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/2 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Bot className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/85">RPA Bot</p>
                    <p className="text-[11px] text-white/35">Aktif · 12 görev kuyruğunda</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Çalışıyor
                </span>
              </div>

              {/* Process steps */}
              <div className="space-y-3 mb-6">
                {[
                  { step: '01', label: 'Kaynak sistemden veri okundu',  done: true  },
                  { step: '02', label: 'Fatura formu otomatik dolduruldu', done: true },
                  { step: '03', label: 'ERP\'ye kayıt oluşturuluyor…',  done: false },
                  { step: '04', label: 'Onay e-postası gönderilecek',   done: false },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <span
                      className="text-[10px] font-bold px-1.5 rounded"
                      style={{ color: s.done ? '#f59e0b' : 'rgba(255,255,255,0.2)', background: s.done ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)' }}
                    >
                      {s.step}
                    </span>
                    <span className={`text-xs ${s.done ? 'text-white/65' : 'text-white/25'}`}>{s.label}</span>
                    {s.done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 ml-auto shrink-0" />}
                  </div>
                ))}
              </div>

              {/* Use cases */}
              <div className="border-t border-white/6 pt-5">
                <p className="text-[11px] text-white/30 mb-3 uppercase tracking-widest">Kullanım Alanları</p>
                <div className="grid grid-cols-2 gap-2">
                  {USE_CASES.map((uc, i) => {
                    const Icon = uc.Icon
                    return (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-white/3 border border-white/5 px-3 py-2">
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: uc.color }} />
                        <span className="text-[11px] text-white/50">{uc.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <motion.div
              className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-black/90 backdrop-blur-sm px-4 py-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-[10px] text-white/35 mb-0.5">Ortalama ROI</p>
              <p className="text-xl font-bold" style={{ color: '#f59e0b' }}>%30–200</p>
              <p className="text-[9px] text-white/25">İlk yıl içinde</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
