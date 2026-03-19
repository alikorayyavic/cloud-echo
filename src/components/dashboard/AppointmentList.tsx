'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, User, Clock, Calendar } from 'lucide-react'

export interface Appointment {
  call_id: string
  name: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  info: string
}

function formatAppointmentDate(date: string): string {
  if (!date) return '—'
  try {
    return new Date(date).toLocaleDateString('tr-TR', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
  } catch {
    return date
  }
}

export function AppointmentList({ appointments }: { appointments: Appointment[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-semibold text-white">Takvim Randevuları</div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/70 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Google Calendar
        </div>
      </div>
      <div className="text-xs text-white/35 mb-4">Onaylanan randevu listesi</div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-white/20">
          <CalendarCheck className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-xs">Henüz onaylı randevu yok</p>
        </div>
      ) : (
        <div className="space-y-2.5 flex-1 overflow-y-auto max-h-64">
          {appointments.map((apt, i) => (
            <motion.div
              key={apt.call_id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <User className="w-3 h-3 text-white/30 flex-shrink-0" />
                  <span className="text-sm font-medium text-white truncate">
                    {apt.name || 'İsim belirtilmedi'}
                  </span>
                </div>
                {apt.date && (
                  <div className="flex items-center gap-3 text-xs text-white/45">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatAppointmentDate(apt.date)}
                    </span>
                    {apt.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {apt.time}
                      </span>
                    )}
                  </div>
                )}
                {!apt.date && apt.info && (
                  <div className="text-xs text-white/40 mt-0.5 line-clamp-1">{apt.info}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
