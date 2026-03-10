'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Cpu, BarChart3, Bot, Zap, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

/* ── Activity feed data ── */
const ALL_ACTIVITIES = [
  { id: 0, agent: 'Read & Answer Agent', task: 'Müşteri sorusu yanıtlandı',        Icon: MessageSquare, color: '#06b6d4', bg: '#042a33', status: 'completed', dur: '2s',  no: '#4521' },
  { id: 1, agent: 'Worker Agent',        task: 'Sipariş kaydı güncellendi',         Icon: Cpu,           color: '#3b82f6', bg: '#0f1b3d', status: 'running',   dur: null,  no: '#4522' },
  { id: 2, agent: 'Reporter Agent',      task: 'Haftalık rapor oluşturuldu',        Icon: BarChart3,     color: '#8b5cf6', bg: '#1a0f3d', status: 'completed', dur: '4s',  no: '#4523' },
  { id: 3, agent: 'RPA',                 task: 'Fatura formu otomatik dolduruldu',  Icon: Bot,           color: '#f59e0b', bg: '#2a1500', status: 'completed', dur: '6s',  no: '#4524' },
  { id: 4, agent: 'AI Automations',      task: 'Onboarding iş akışı tetiklendi',   Icon: Zap,           color: '#4ade80', bg: '#0a2010', status: 'running',   dur: null,  no: '#4525' },
  { id: 5, agent: 'Read & Answer Agent', task: 'Stok durumu sorgulandı',            Icon: MessageSquare, color: '#06b6d4', bg: '#042a33', status: 'completed', dur: '1s',  no: '#4526' },
  { id: 6, agent: 'Worker Agent',        task: 'Yeni kullanıcı kaydı oluşturuldu', Icon: Cpu,           color: '#3b82f6', bg: '#0f1b3d', status: 'completed', dur: '3s',  no: '#4527' },
  { id: 7, agent: 'Reporter Agent',      task: 'Satış analizi tamamlandı',          Icon: BarChart3,     color: '#8b5cf6', bg: '#1a0f3d', status: 'running',   dur: null,  no: '#4528' },
]

const MINI_STATS = [
  { value: '1.628', label: 'Günlük Görev' },
  { value: '%92',   label: 'Otomatik Çözüm' },
  { value: '7/24',  label: 'Aktif' },
]

const VISIBLE_MS  = 10_000  // card stays 10 seconds
const ADD_MS      = 3_500   // new card every 3.5 seconds
const MAX_VISIBLE = 4       // max cards shown at once

type QueueCard = typeof ALL_ACTIVITIES[0] & { uid: string; addedAt: number }

function now() {
  return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function ActivityCard({ item }: { item: QueueCard }) {
  const [time] = useState(now)
  const Icon = item.Icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{    opacity: 0, y: -28, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl border border-white/[0.07] bg-white/3 p-4 backdrop-blur-sm overflow-hidden hover:border-white/12 transition-colors duration-300"
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
        style={{ background: item.color, opacity: 0.55 }}
      />

      <div className="pl-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10"
            style={{ background: item.bg, boxShadow: `0 0 12px ${item.color}25` }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] text-white/30 mb-0.5 truncate">
              {item.agent}
              <span className="mx-1.5 text-white/12">→</span>
              <span className="text-white/20">Otomatik İşlem</span>
            </p>
            <p className="text-sm font-medium text-white/80 leading-snug truncate">{item.task}</p>

            <div className="mt-2">
              {item.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Tamamlandı
                  {item.dur && <span className="ml-1 opacity-55">{item.dur}</span>}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  Devam Ediyor
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Time + task no */}
        <div className="shrink-0 text-right">
          <p className="text-[10px] text-white/22 tabular-nums">{time}</p>
          <p className="text-[10px] text-white/18 mt-0.5">{item.no}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function LiveActivity() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [queue, setQueue] = useState<QueueCard[]>([])
  const nextIdxRef = useRef(0)

  useEffect(() => {
    /* Seed initial cards staggered so they don't all expire at once */
    const initial: QueueCard[] = [0, 1, 2, 3].map((i) => ({
      ...ALL_ACTIVITIES[i],
      uid:      `card-init-${i}`,
      addedAt:  Date.now() - i * (ADD_MS * 0.8), // stagger backwards in time
    }))
    setQueue(initial)
    nextIdxRef.current = 4

    /* Add a new card periodically */
    const addId = setInterval(() => {
      const idx = nextIdxRef.current % ALL_ACTIVITIES.length
      nextIdxRef.current += 1
      setQueue((prev) => {
        const next = [
          ...prev,
          { ...ALL_ACTIVITIES[idx], uid: `card-${Date.now()}`, addedAt: Date.now() },
        ]
        /* Keep at most MAX_VISIBLE */
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next
      })
    }, ADD_MS)

    /* Remove cards older than VISIBLE_MS */
    const removeId = setInterval(() => {
      const cutoff = Date.now() - VISIBLE_MS
      setQueue((prev) => prev.filter((c) => c.addedAt > cutoff))
    }, 600)

    return () => {
      clearInterval(addId)
      clearInterval(removeId)
    }
  }, [])

  return (
    <section ref={ref} className="relative bg-black py-28 px-6 overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />

      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 500,
          top: '50%', left: '30%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Text + stats ── */}
          <div>
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs text-emerald-400/80"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Canlı Aktivite
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-white/90">AI Asistanlarınız</span>
              <br />
              <span className="gradient-text">7/24 Çalışıyor</span>
            </motion.h2>

            <motion.p
              className="text-white/40 text-base leading-relaxed mb-8 max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              Satıştan müşteri desteğine, raporlamadan otomasyon süreçlerine — gerçek zamanlı görev akışını izleyin.
            </motion.p>

            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                className="glow-border group inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Demo Görün
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {MINI_STATS.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold gradient-text leading-none mb-1">{s.value}</div>
                  <div className="text-xs text-white/35">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Live activity feed ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
          >
            {/* Fade mask top — older cards fade out here */}
            <div
              className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, #000 30%, transparent)' }}
            />

            {/* Feed */}
            <div className="relative flex flex-col gap-3 py-3 min-h-[380px] justify-end overflow-hidden">
              <AnimatePresence mode="sync">
                {queue.map((item) => (
                  <ActivityCard key={item.uid} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Fade mask bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #000 30%, transparent)' }}
            />

            {/* Live badge */}
            <div className="absolute -top-3 -right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/90 backdrop-blur-sm px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] text-white/50 font-medium">Canlı</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
