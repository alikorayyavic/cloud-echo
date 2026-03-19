'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export interface IntentGroup {
  label: string
  count: number
}

const COLORS: Record<string, string> = {
  'Randevu Oluşturdu': '#34d399', // emerald-400
  'Bilgi Aldı':        '#60a5fa', // blue-400
  'Fiyat Öğrendi':     '#fbbf24', // amber-400
  'Randevu İptali':    '#fb923c', // orange-400
  'Diğer':             '#6b7280', // gray-500
}

const DEFAULT_COLOR = '#6b7280'

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: IntentGroup }[] }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-black/90 border border-white/15 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-white/60 mb-0.5">{name}</div>
      <div className="text-white font-semibold">{value} arama</div>
    </div>
  )
}

export function IntentDonutChart({ data }: { data: IntentGroup[] }) {
  const total = data.reduce((a, d) => a + d.count, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col"
    >
      <div className="text-sm font-semibold text-white mb-1">Arama Niyeti Dağılımı</div>
      <div className="text-xs text-white/35 mb-4">Kategoriye göre çağrı yüzdesi</div>

      <div className="flex-1 flex items-center gap-4 min-h-0">
        {/* Chart */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={COLORS[entry.label] ?? DEFAULT_COLOR}
                    opacity={0.9}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold text-white tabular-nums">{total}</div>
            <div className="text-[10px] text-white/35">toplam</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {data.map((entry) => {
            const pct = total > 0 ? Math.round((entry.count / total) * 100) : 0
            const color = COLORS[entry.label] ?? DEFAULT_COLOR
            return (
              <div key={entry.label} className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <div className="text-xs text-white/60 truncate flex-1">{entry.label}</div>
                <div className="text-xs font-semibold text-white tabular-nums flex-shrink-0">
                  {pct}%
                </div>
              </div>
            )
          })}
          {data.length === 0 && (
            <div className="text-xs text-white/25">Henüz veri yok</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
