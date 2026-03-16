'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, ArrowRight, GitBranch, Cpu, MessageSquare, BarChart3, Globe, Bell } from 'lucide-react'
import Link from 'next/link'

const STATS = [
  { value: '+42%', label: 'Süreç Verimliliği' },
  { value: '500+', label: 'Uygulama Entegrasyonu' },
  { value: '2-4s', label: 'Kurulum Süresi' },
]

const INTEGRATIONS = [
  { label: 'CRM Senkronizasyonu',    Icon: Cpu,          color: '#4ade80' },
  { label: 'Lead Yönetimi',           Icon: GitBranch,    color: '#4ade80' },
  { label: 'Müşteri Bildirimleri',    Icon: Bell,         color: '#4ade80' },
  { label: 'Raporlama Akışları',      Icon: BarChart3,    color: '#4ade80' },
  { label: 'AI Sohbet Entegrasyonu',  Icon: MessageSquare,color: '#4ade80' },
  { label: 'Web Hook Tetikleyiciler', Icon: Globe,        color: '#4ade80' },
]

/* Workflow node component */
function WorkflowNode({ label, Icon, color, delay }: { label: string; Icon: React.ElementType; color: string; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200"
        style={{ background: `${color}18`, boxShadow: `0 0 8px ${color}20` }}
      >
        <Icon className="h-3 w-3" style={{ color }} />
      </div>
      <span className="text-[11px] text-slate-500 whitespace-nowrap">{label}</span>
    </motion.div>
  )
}

export default function AIAutomationsSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative bg-white py-28 px-6 overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent)' }}
      />

      {/* Green background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 500,
          top: '50%', left: '25%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(74,222,128,0.06) 0%, rgba(74,222,128,0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Visual (workflow) */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                    <Zap className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">n8n İş Akışı</p>
                    <p className="text-[11px] text-slate-400">Aktif · Son tetikleme 2 dk önce</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Canlı
                </span>
              </div>

              {/* Workflow visual */}
              <div className="space-y-2 mb-5">
                {/* Trigger */}
                <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5">
                  <Bell className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-xs font-medium text-green-400">Tetikleyici: Yeni müşteri kaydı</span>
                </div>
                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-slate-300" />
                </div>
                {/* Node 1 */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-slate-500">AI: Karşılama mesajı oluştur</span>
                  <span className="ml-auto text-[9px] text-emerald-400 bg-emerald-500/10 rounded-full px-1.5 py-0.5">✓ 0.3s</span>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-slate-300" />
                </div>
                {/* Node 2 */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <Cpu className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-slate-500">CRM: Müşteri profili oluştur</span>
                  <span className="ml-auto text-[9px] text-emerald-400 bg-emerald-500/10 rounded-full px-1.5 py-0.5">✓ 0.8s</span>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-slate-200" />
                </div>
                {/* Node 3 - in progress */}
                <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-2.5">
                  <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-blue-300/70">E-posta bildirimi gönderiliyor…</span>
                  <span className="ml-auto text-[9px] text-blue-400 bg-blue-500/10 rounded-full px-1.5 py-0.5 animate-pulse">⋯</span>
                </div>
              </div>

              {/* Integrations grid */}
              <div className="border-t border-slate-200 pt-4">
                <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-widest">Entegrasyonlar</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {INTEGRATIONS.map((item, i) => {
                    const Icon = item.Icon
                    return (
                      <WorkflowNode key={i} label={item.label} Icon={Icon} color={item.color} delay={i * 0.05} />
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <motion.div
              className="absolute -bottom-4 -right-4 rounded-xl border border-slate-200 bg-white backdrop-blur-sm px-4 py-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <p className="text-[10px] text-slate-400 mb-0.5">Verimlilik Artışı</p>
              <p className="text-xl font-bold text-green-400">+42%</p>
              <p className="text-[9px] text-slate-300">Standart otomasyona göre</p>
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <div className="order-1 lg:order-2">
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-xs text-green-400/80"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Zap className="h-3 w-3" />
              n8n Tabanlı AI Otomasyon
            </motion.div>

            <motion.h2
              className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-slate-900">İş Akışlarınıza</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Zeka Katın
              </span>
            </motion.h2>

            <motion.p
              className="text-slate-400 text-base leading-relaxed mb-8 max-w-md"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              n8n altyapısıyla 500'den fazla uygulama ve servisi birbirine bağlayın. LLM entegrasyonu sayesinde akışlarınız sadece otomasyondan fazlasını yapar — veri analiz eder, karar alır ve müşterilerinizle etkileşime girer.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {STATS.map((s, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 leading-none mb-1">{s.value}</div>
                  <div className="text-[11px] text-slate-400">{s.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/products/ai-automations"
                  className="group inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/8 px-6 py-3 text-sm font-semibold text-green-400 hover:border-green-500/60 hover:bg-green-500/12 transition-all duration-200"
                >
                  Otomasyon Çözümlerini Keşfet
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
