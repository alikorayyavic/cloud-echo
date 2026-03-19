'use client'

import { motion } from 'framer-motion'
import { PhoneCall, MessageSquare, CalendarSearch, CalendarCheck, ArrowDown } from 'lucide-react'

export interface FunnelData {
  total: number
  withIntent: number
  withAvailabilityCheck: number
  booked: number
}

export function FunnelStats({ data }: { data: FunnelData }) {
  const steps = [
    {
      label: 'Aramaya Başlayanlar',
      sublabel: 'Bağlanan tüm çağrılar',
      value: data.total,
      Icon: PhoneCall,
      color: 'text-cyan-400',
      bar: 'from-cyan-500/60 to-cyan-500/20',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      num: 'text-cyan-400',
    },
    {
      label: 'Niyet Belirtenler',
      sublabel: 'Arama amacı tespit edildi',
      value: data.withIntent,
      Icon: MessageSquare,
      color: 'text-blue-400',
      bar: 'from-blue-500/60 to-blue-500/20',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      num: 'text-blue-400',
    },
    {
      label: 'Müsaitlik Araştıranlar',
      sublabel: 'Takvim veya müsaitlik sordu',
      value: data.withAvailabilityCheck,
      Icon: CalendarSearch,
      color: 'text-violet-400',
      bar: 'from-violet-500/60 to-violet-500/20',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      num: 'text-violet-400',
    },
    {
      label: 'Randevu Alanlar',
      sublabel: 'Randevu başarıyla onaylandı',
      value: data.booked,
      Icon: CalendarCheck,
      color: 'text-emerald-400',
      bar: 'from-emerald-500/60 to-emerald-500/20',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      num: 'text-emerald-400',
    },
  ]

  const maxVal = steps[0].value || 1
  const overallConv = maxVal > 0 ? Math.round((data.booked / maxVal) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-sm font-semibold text-white mb-1">Kullanıcı Akışı</div>
          <div className="text-xs text-white/35">Aramadan randevuya dönüşüm hunisi</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums text-emerald-400">{overallConv}%</div>
          <div className="text-[10px] text-white/30">genel dönüşüm</div>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Funnel shape (narrowing bars) */}
        <div className="flex flex-col gap-0 w-24 shrink-0 justify-around py-1">
          {steps.map((step, i) => {
            const widthPct = maxVal > 0 ? Math.max(24, Math.round((step.value / maxVal) * 100)) : 24
            return (
              <div key={step.label} className="flex flex-col items-center">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.55 + i * 0.1, duration: 0.45, ease: 'easeOut' }}
                  className={`h-7 rounded-lg bg-linear-to-r ${step.bar} border ${step.border} flex items-center justify-center`}
                  style={{ width: `${widthPct}%` }}
                >
                  <span className={`text-[11px] font-bold tabular-nums ${step.num}`}>{step.value}</span>
                </motion.div>
                {i < steps.length - 1 && (
                  <ArrowDown className="w-3 h-3 text-white/10 my-0.5" />
                )}
              </div>
            )
          })}
        </div>

        {/* Step details */}
        <div className="flex-1 flex flex-col gap-0">
          {steps.map((step, i) => {
            const pct = maxVal > 0 ? (step.value / maxVal) * 100 : 0
            const stepConv = i > 0 && steps[i - 1].value > 0
              ? Math.round((step.value / steps[i - 1].value) * 100)
              : null
            const dropOff = i > 0 ? steps[i - 1].value - step.value : null

            return (
              <div key={step.label}>
                {/* Drop-off row between steps */}
                {dropOff !== null && (
                  <div className="flex items-center gap-2 pl-9 py-0.5">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-white/20 shrink-0">
                      {dropOff > 0 ? `${dropOff} arama düştü` : 'kayıp yok'}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                )}

                <div className="flex items-start gap-3 py-1.5">
                  <div className={`w-7 h-7 rounded-lg ${step.bg} border ${step.border} flex items-center justify-center shrink-0 mt-0.5`}>
                    <step.Icon className={`w-3.5 h-3.5 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div>
                        <div className="text-xs text-white/70 font-medium leading-tight">{step.label}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{step.sublabel}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {stepConv !== null && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                            stepConv >= 70 ? 'text-emerald-400/70 bg-emerald-500/8 border-emerald-500/15'
                            : stepConv >= 40 ? 'text-yellow-400/70 bg-yellow-500/8 border-yellow-500/15'
                            : 'text-red-400/60 bg-red-500/8 border-red-500/15'
                          }`}>
                            ↓{stepConv}%
                          </span>
                        )}
                        <span className={`text-base font-bold tabular-nums ${step.num}`}>{step.value}</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-linear-to-r ${step.bar}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
