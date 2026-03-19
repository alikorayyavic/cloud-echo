'use client'

import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

export interface DailyVolume {
  date: string   // "dd MMM" formatted
  count: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-black/90 border border-white/15 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-white/50 mb-0.5">{label}</div>
      <div className="text-white font-semibold">{payload[0].value} arama</div>
    </div>
  )
}

export function CallVolumeChart({ data }: { data: DailyVolume[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col"
    >
      <div className="text-sm font-semibold text-white mb-1">Arama Hacmi</div>
      <div className="text-xs text-white/35 mb-4">Son 14 günlük çağrı trendi</div>

      <div className="flex-1 min-h-0" style={{ height: 180 }}>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-white/25">
            Henüz veri yok
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="cvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#cvGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#22d3ee', stroke: '#000', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
