'use client'

import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion'
import { InteractiveRobotSpline } from '@/components/interactive-3d-robot'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, MessageSquare, Cpu, BarChart3, Bot, Zap, CheckCircle2, Loader2, Phone, PhoneOff } from 'lucide-react'
import Link from 'next/link'
import { RetellWebClient } from 'retell-client-js-sdk'

type CallStatus = 'idle' | 'connecting' | 'active'

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

/* ── Activity feed data ── */
const ACTIVITIES = [
  { id: 0, agent: 'Read & Answer Agent', task: 'Müşteri sorusu yanıtlandı',        Icon: MessageSquare, color: '#06b6d4', bg: '#042a33', status: 'completed', dur: '2s',  no: '#4521' },
  { id: 1, agent: 'Worker Agent',        task: 'Sipariş kaydı güncellendi',         Icon: Cpu,           color: '#3b82f6', bg: '#0f1b3d', status: 'running',   dur: null,  no: '#4522' },
  { id: 2, agent: 'Reporter Agent',      task: 'Haftalık rapor oluşturuldu',        Icon: BarChart3,     color: '#8b5cf6', bg: '#1a0f3d', status: 'completed', dur: '4s',  no: '#4523' },
  { id: 3, agent: 'RPA',                 task: 'Fatura formu otomatik dolduruldu',  Icon: Bot,           color: '#f59e0b', bg: '#2a1500', status: 'completed', dur: '6s',  no: '#4524' },
  { id: 4, agent: 'AI Automations',      task: 'Onboarding iş akışı tetiklendi',   Icon: Zap,           color: '#4ade80', bg: '#0a2010', status: 'running',   dur: null,  no: '#4525' },
  { id: 5, agent: 'Read & Answer Agent', task: 'Stok durumu sorgulandı',            Icon: MessageSquare, color: '#06b6d4', bg: '#042a33', status: 'completed', dur: '1s',  no: '#4526' },
  { id: 6, agent: 'Worker Agent',        task: 'Yeni kullanıcı kaydı oluşturuldu', Icon: Cpu,           color: '#3b82f6', bg: '#0f1b3d', status: 'completed', dur: '3s',  no: '#4527' },
  { id: 7, agent: 'Reporter Agent',      task: 'Satış analizi tamamlandı',          Icon: BarChart3,     color: '#8b5cf6', bg: '#1a0f3d', status: 'running',   dur: null,  no: '#4528' },
]

const VISIBLE_MS  = 10_000
const ADD_MS      = 3_500
const MAX_VISIBLE = 4

type QueueCard = typeof ACTIVITIES[0] & { uid: string; addedAt: number }

function nowTime() {
  return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/* ── Mini notification card ── */
function MiniCard({ item }: { item: QueueCard }) {
  const [time] = useState(nowTime)
  const Icon = item.Icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -24, scale: 0.97 }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="relative rounded-xl border border-slate-200 bg-white shadow-sm p-3.5 backdrop-blur-sm overflow-hidden"
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: item.color, opacity: 0.55 }}
      />
      <div className="pl-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200"
            style={{ background: item.bg, boxShadow: `0 0 10px ${item.color}25` }}
          >
            <Icon className="h-3 w-3" style={{ color: item.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 mb-0.5 truncate">{item.agent}</p>
            <p className="text-xs font-medium text-slate-700 leading-snug truncate">{item.task}</p>
            <div className="mt-1.5">
              {item.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-2 w-2" />
                  Tamamlandı
                  {item.dur && <span className="opacity-55">{item.dur}</span>}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Loader2 className="h-2 w-2 animate-spin" />
                  Devam Ediyor
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[9px] text-slate-300 tabular-nums">{time}</p>
          <p className="text-[9px] text-slate-300 mt-0.5">{item.no}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Live activity feed (left column) ── */
function ActivityFeed() {
  const [queue, setQueue] = useState<QueueCard[]>([])
  const nextIdxRef = useRef(0)

  useEffect(() => {
    const initial: QueueCard[] = [0, 1, 2, 3].map((i) => ({
      ...ACTIVITIES[i],
      uid:     `card-init-${i}`,
      addedAt: Date.now() - i * (ADD_MS * 0.8),
    }))
    setQueue(initial)
    nextIdxRef.current = 4

    const addId = setInterval(() => {
      const idx = nextIdxRef.current % ACTIVITIES.length
      nextIdxRef.current += 1
      setQueue((prev) => {
        const next = [...prev, { ...ACTIVITIES[idx], uid: `card-${Date.now()}`, addedAt: Date.now() }]
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next
      })
    }, ADD_MS)

    const removeId = setInterval(() => {
      const cutoff = Date.now() - VISIBLE_MS
      setQueue((prev) => prev.filter((c) => c.addedAt > cutoff))
    }, 600)

    return () => { clearInterval(addId); clearInterval(removeId) }
  }, [])

  return (
    <div className="relative flex flex-col gap-2.5 py-2 min-h-[300px] justify-end overflow-hidden">
      {/* Fade mask top */}
      <div
        className="absolute top-0 left-0 right-0 h-10 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #ffffff 20%, transparent)' }}
      />
      <AnimatePresence mode="sync">
        {queue.map((item) => <MiniCard key={item.uid} item={item} />)}
      </AnimatePresence>
      {/* Live badge */}
      <div className="absolute -top-2 right-0 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/90 backdrop-blur-sm shadow-sm px-2.5 py-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="text-[10px] text-slate-500 font-medium">Canlı</span>
      </div>
    </div>
  )
}

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
          className="text-[9px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 text-slate-500 group-hover:text-slate-700"
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
          className="absolute rounded-full bg-slate-400/40"
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

  const [callStatus, setCallStatus]         = useState<CallStatus>('idle')
  const [isAgentTalking, setIsAgentTalking] = useState(false)
  const [isMeTalking, setIsMeTalking]       = useState(false)
  const retellRef = useRef<InstanceType<typeof RetellWebClient> | null>(null)

  useEffect(() => { return () => { retellRef.current?.stopCall() } }, [])

  async function startCall() {
    setCallStatus('connecting')
    try {
      const res = await fetch('/api/create-call', { method: 'POST' })
      const { access_token, error } = await res.json()
      if (error || !access_token) throw new Error()
      const client = new RetellWebClient()
      retellRef.current = client
      client.on('call_started',        () => setCallStatus('active'))
      client.on('call_ended',          () => { setCallStatus('idle'); setIsAgentTalking(false); setIsMeTalking(false) })
      client.on('agent_start_talking', () => setIsAgentTalking(true))
      client.on('agent_stop_talking',  () => setIsAgentTalking(false))
      client.on('user_start_talking',  () => setIsMeTalking(true))
      client.on('user_stop_talking',   () => setIsMeTalking(false))
      client.on('error',               () => setCallStatus('idle'))
      await client.startCall({ accessToken: access_token })
    } catch {
      setCallStatus('idle')
    }
  }

  function endCall() {
    retellRef.current?.stopCall()
    setCallStatus('idle')
    setIsAgentTalking(false)
    setIsMeTalking(false)
  }

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
      className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16"
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
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Activity feed ── */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs text-cyan-400/80 self-start">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Yapay Zeka Destekli SaaS Platformu
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-5">
              <span className="gradient-text">AI Asistanlarınız</span>
              <br />
              <span className="text-slate-900">7/24 Çalışıyor</span>
            </h2>

            {/* CTA */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/try-it"
                  className="glow-border group inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
                >
                  Hemen Başlayın
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={callStatus === 'idle' ? startCall : endCall}
                disabled={callStatus === 'connecting'}
                className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  callStatus === 'active'
                    ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15'
                }`}
              >
                {callStatus === 'connecting' ? (
                  <><span className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" /> Bağlanıyor...</>
                ) : callStatus === 'active' ? (
                  <><PhoneOff className="h-3.5 w-3.5" /> Bitir</>
                ) : (
                  <><Phone className="h-3.5 w-3.5" /> Test Et</>
                )}
              </motion.button>
            </div>

            {/* Active call indicator */}
            <AnimatePresence>
              {callStatus === 'active' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mb-4 inline-flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2.5"
                >
                  <span className="text-xl">👩‍⚕️</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Ayşe — Avicenna Hastanesi</p>
                    <p className="text-[11px] text-cyan-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      {isAgentTalking ? 'Konuşuyor...' : isMeTalking ? 'Sizi dinliyor...' : 'Çevrimiçi'}
                    </p>
                  </div>
                  <div className="flex items-end gap-0.5 h-5 ml-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 rounded-full bg-cyan-400/70"
                        animate={isAgentTalking || isMeTalking ? { height: [2, 14 + i * 2, 2] } : { height: 2 }}
                        transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live notification feed */}
            <ActivityFeed />
          </motion.div>

          {/* ── Right: Robot + Orbit ── */}
          <div
            ref={containerRef}
            className="relative flex items-center justify-center"
            style={{ height: 500 }}
          >
            {/* Orbit ring */}
            <div
              className="absolute rounded-full border border-dashed border-slate-300/60 pointer-events-none"
              style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
            />

            {/* Second subtle ring */}
            <div
              className="absolute rounded-full border border-slate-200/40 pointer-events-none"
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
        <span className="text-[10px] text-slate-300 tracking-widest uppercase">Keşfet</span>
        <motion.div
          className="w-px h-8 bg-linear-to-b from-slate-300 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
