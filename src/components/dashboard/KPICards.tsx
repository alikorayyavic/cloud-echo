'use client'

import { motion } from 'framer-motion'
import { Phone, TrendingUp, Clock, CalendarCheck } from 'lucide-react'

interface KPIData {
  totalCalls: number
  successRate: number
  avgDuration: string
  todayCount: number
}

export function KPICards({ data, loading }: { data: KPIData; loading: boolean }) {
  const cards = [
    {
      label: 'Toplam Arama',
      value: loading ? '—' : String(data.totalCalls),
      sub: 'tüm zamanlar',
      Icon: Phone,
      color: 'cyan',
      gradient: 'from-cyan-500/20 to-cyan-500/0',
      border: 'border-cyan-500/20',
      icon_bg: 'bg-cyan-500/15',
      icon_color: 'text-cyan-400',
      glow: 'shadow-cyan-500/10',
    },
    {
      label: 'Başarı Oranı',
      value: loading ? '—' : `${data.successRate}%`,
      sub: 'randevu dönüşümü',
      Icon: TrendingUp,
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-emerald-500/0',
      border: 'border-emerald-500/20',
      icon_bg: 'bg-emerald-500/15',
      icon_color: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
    {
      label: 'Ortalama Süre',
      value: loading ? '—' : data.avgDuration,
      sub: 'dakika:saniye',
      Icon: Clock,
      color: 'violet',
      gradient: 'from-violet-500/20 to-violet-500/0',
      border: 'border-violet-500/20',
      icon_bg: 'bg-violet-500/15',
      icon_color: 'text-violet-400',
      glow: 'shadow-violet-500/10',
    },
    {
      label: 'Bugünkü Aramalar',
      value: loading ? '—' : String(data.todayCount),
      sub: 'bugün',
      Icon: CalendarCheck,
      color: 'amber',
      gradient: 'from-amber-500/20 to-amber-500/0',
      border: 'border-amber-500/20',
      icon_bg: 'bg-amber-500/15',
      icon_color: 'text-amber-400',
      glow: 'shadow-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35 }}
          className={`relative overflow-hidden rounded-2xl border ${card.border} bg-white/5 backdrop-blur-sm p-5 shadow-lg ${card.glow}`}
        >
          {/* Gradient blob */}
          <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-linear-to-br ${card.gradient} blur-2xl pointer-events-none`} />

          <div className="relative">
            <div className={`w-9 h-9 rounded-xl ${card.icon_bg} flex items-center justify-center mb-4`}>
              <card.Icon className={`w-4.5 h-4.5 ${card.icon_color}`} />
            </div>

            <div className="text-3xl font-bold tabular-nums text-white mb-1">
              {card.value}
            </div>
            <div className="text-sm font-medium text-white/70">{card.label}</div>
            <div className="text-xs text-white/30 mt-0.5">{card.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
