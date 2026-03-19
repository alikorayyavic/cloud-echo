'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, X,
  User, Clock, Calendar, CalendarCheck, Phone,
} from 'lucide-react'
import type { Appointment } from './AppointmentList'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekDays(base: Date): Date[] {
  const monday = new Date(base)
  const day = monday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

const TR_DAYS  = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const TR_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  appointments: Appointment[]
}

export function WeeklyCalendar({ appointments }: Props) {
  const [baseDate, setBaseDate] = useState(new Date())
  const [selected, setSelected] = useState<Appointment | null>(null)

  const weekDays = getWeekDays(baseDate)
  const todayISO = toISO(new Date())

  const prevWeek = () => {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - 7)
    setBaseDate(d)
  }
  const nextWeek = () => {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + 7)
    setBaseDate(d)
  }

  // Group appointments by date
  const byDate: Record<string, Appointment[]> = {}
  for (const apt of appointments) {
    if (apt.date) {
      byDate[apt.date] = [...(byDate[apt.date] ?? []), apt]
    }
  }

  const weekLabel = `${weekDays[0].getDate()} ${TR_MONTHS[weekDays[0].getMonth()]} – ${weekDays[6].getDate()} ${TR_MONTHS[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-white">Haftalık Takvim</div>
          <div className="text-xs text-white/35 mt-0.5">{weekLabel}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevWeek}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/50" />
          </button>
          <button
            onClick={() => setBaseDate(new Date())}
            className="px-2.5 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/50 hover:text-white transition-colors"
          >
            Bugün
          </button>
          <button
            onClick={nextWeek}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 flex-1">
        {weekDays.map((day, idx) => {
          const iso = toISO(day)
          const dayApts = byDate[iso] ?? []
          const isToday = iso === todayISO

          return (
            <div key={iso} className="flex flex-col gap-1">
              {/* Day header */}
              <div className={`text-center pb-2 border-b ${isToday ? 'border-cyan-500/40' : 'border-white/8'}`}>
                <div className={`text-[10px] font-medium ${isToday ? 'text-cyan-400' : 'text-white/35'}`}>
                  {TR_DAYS[idx]}
                </div>
                <div className={`text-lg font-bold tabular-nums leading-tight ${isToday ? 'text-cyan-400' : 'text-white/60'}`}>
                  {day.getDate()}
                </div>
                {isToday && (
                  <div className="w-1 h-1 rounded-full bg-cyan-400 mx-auto mt-0.5" />
                )}
              </div>

              {/* Appointments */}
              <div className="flex flex-col gap-1 min-h-[80px]">
                {dayApts.map((apt, i) => (
                  <motion.button
                    key={apt.call_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(apt)}
                    className="w-full text-left p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/25 transition-colors group"
                  >
                    {apt.time && (
                      <div className="text-[9px] text-emerald-400/70 font-mono mb-0.5">{apt.time}</div>
                    )}
                    <div className="text-[10px] text-white/80 font-medium leading-tight line-clamp-2 group-hover:text-white transition-colors">
                      {apt.name || 'Sanal Anjiyo'}
                    </div>
                  </motion.button>
                ))}
                {dayApts.length === 0 && (
                  <div className="flex-1 rounded-lg border border-dashed border-white/5 min-h-[50px]" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
            >
              <div className="mx-4 rounded-2xl border border-white/15 bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-5">
                {/* Modal header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                      <CalendarCheck className="w-4.5 h-4.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Randevu Detayı</div>
                      <div className="text-xs text-emerald-400/70">Onaylandı</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Patient name */}
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/8">
                    <User className="w-4 h-4 text-white/40 shrink-0" />
                    <div>
                      <div className="text-[10px] text-white/35 mb-0.5">Hasta</div>
                      <div className="text-sm font-medium text-white">{selected.name || '—'}</div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8">
                      <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-[10px] text-white/35 mb-0.5">Tarih</div>
                        <div className="text-xs font-medium text-white">
                          {selected.date
                            ? new Date(selected.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
                            : '—'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8">
                      <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <div className="text-[10px] text-white/35 mb-0.5">Saat</div>
                        <div className="text-xs font-medium text-white">{selected.time || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment info */}
                  {selected.info && (
                    <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
                      <div className="text-[10px] text-cyan-400/60 mb-1">Randevu Notu</div>
                      <p className="text-xs text-white/65 leading-relaxed">{selected.info}</p>
                    </div>
                  )}

                  {/* Procedure */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-emerald-400/60 mb-0.5">İşlem</div>
                      <div className="text-xs text-white/70">Sanal Anjiyo</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
