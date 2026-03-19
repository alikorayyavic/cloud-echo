'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, User, Phone, Mail, FileText, Heart,
  ChevronDown, CheckCircle, TrendingUp,
  Calendar, Clock, Users, Activity, CalendarCheck,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  ad: string; soyad: string; telefon: string; email: string
  yas: string; sikayet: string; oncelikli_gun: string; randevu_tercihi: string; mesaj: string
}

interface Submission {
  id: string; timestamp: Date; data: FormData; source: string
}

const EMPTY: FormData = {
  ad: '', soyad: '', telefon: '', email: '',
  yas: '', sikayet: '', oncelikli_gun: '', randevu_tercihi: '', mesaj: '',
}

const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: 'demo-1', timestamp: new Date(Date.now() - 86400000 * 2), source: 'Instagram',
    data: { ad: 'Mehmet', soyad: 'Yılmaz', telefon: '0532 111 22 33', email: 'mehmet@email.com', yas: '58', sikayet: 'Göğüs ağrısı', oncelikli_gun: 'Pazartesi', randevu_tercihi: 'Sabah (08-12)', mesaj: '' },
  },
  {
    id: 'demo-2', timestamp: new Date(Date.now() - 86400000), source: 'TikTok',
    data: { ad: 'Fatma', soyad: 'Kaya', telefon: '0545 222 33 44', email: '', yas: '62', sikayet: 'Çarpıntı', oncelikli_gun: 'Çarşamba', randevu_tercihi: 'Öğleden sonra (12-17)', mesaj: 'Daha önce kalp rahatsızlığı geçirdim.' },
  },
  {
    id: 'demo-3', timestamp: new Date(Date.now() - 3600000 * 5), source: 'Instagram',
    data: { ad: 'Ali', soyad: 'Demir', telefon: '0507 333 44 55', email: 'ali.demir@mail.com', yas: '54', sikayet: 'Göğüs ağrısı', oncelikli_gun: 'Perşembe', randevu_tercihi: 'Sabah (08-12)', mesaj: '' },
  },
]

const SIKAYET_OPTIONS = [
  'Göğüs ağrısı', 'Nefes darlığı', 'Çarpıntı', 'Baş dönmesi',
  'Egzersiz intoleransı', 'Yorgunluk', 'Bacak ağrısı', 'Diğer',
]
const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
const TIMES = ['Sabah (08-12)', 'Öğleden sonra (12-17)']

const SOURCE_CONFIG = [
  { name: 'Instagram', abbr: 'IG',  color: 'text-pink-400',   bg: 'bg-pink-500/15',   border: 'border-pink-500/25' },
  { name: 'TikTok',    abbr: 'TT',  color: 'text-teal-400',   bg: 'bg-teal-500/15',   border: 'border-teal-500/25' },
  { name: 'Facebook',  abbr: 'FB',  color: 'text-blue-400',   bg: 'bg-blue-500/15',   border: 'border-blue-500/25' },
  { name: 'Website',   abbr: 'WEB', color: 'text-cyan-400',   bg: 'bg-cyan-500/15',   border: 'border-cyan-500/25' },
]

const CHART_COLORS = ['#34d399', '#60a5fa', '#f59e0b', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#6b7280']

function sourceColor(src: string) {
  if (src === 'Instagram') return 'text-pink-400'
  if (src === 'TikTok') return 'text-teal-400'
  if (src === 'Facebook') return 'text-blue-400'
  return 'text-cyan-400'
}

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

function Dropdown({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 hover:border-white/20 transition-all"
      >
        <span className={value ? 'text-white' : 'text-white/25'}>{value || placeholder || 'Seçiniz'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border border-white/15 overflow-hidden shadow-2xl shadow-black/60"
            style={{ background: '#0f0f0f' }}
          >
            {options.map(o => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false) }}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-white/8 ${
                  value === o ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/65'
                }`}
              >
                {o}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/45 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 hover:border-white/20 transition-all"
    />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SocialTab() {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [submissions, setSubmissions] = useState<Submission[]>(DEMO_SUBMISSIONS)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedSub, setSelectedSub] = useState<Submission | null>(DEMO_SUBMISSIONS[2])

  const set = (key: keyof FormData) => (v: string) => setForm(f => ({ ...f, [key]: v }))

  const handleSubmit = async () => {
    if (!form.ad || !form.soyad || !form.telefon || !form.sikayet) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      timestamp: new Date(),
      data: { ...form },
      source: 'Website',
    }
    setSubmissions(s => [newSub, ...s])
    setSelectedSub(newSub)
    setSubmitted(true)
    setSubmitting(false)
    setTimeout(() => { setForm(EMPTY); setSubmitted(false) }, 2500)
  }

  const valid = !!(form.ad && form.soyad && form.telefon && form.sikayet)

  // Derived data
  const todayLeads = submissions.filter(s => s.timestamp.toDateString() === new Date().toDateString()).length
  const sourceCounts = SOURCE_CONFIG.map(src => ({
    ...src, count: submissions.filter(s => s.source === src.name).length,
  }))
  const diseaseData = SIKAYET_OPTIONS
    .map((s, i) => ({ name: s.length > 14 ? s.slice(0, 13) + '…' : s, fullName: s, count: submissions.filter(sub => sub.data.sikayet === s).length, color: CHART_COLORS[i] }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)

  const timeAgo = (ts: Date) => {
    const diff = Date.now() - ts.getTime()
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (d > 0) return `${d}g önce`
    if (h > 0) return `${h}sa önce`
    return 'şimdi'
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* ── Top stats bar ── */}
      <div className="grid grid-cols-4 border-b border-white/8 divide-x divide-white/8 shrink-0">
        {[
          { label: 'Toplam Lead', value: submissions.length, color: 'text-violet-400' },
          { label: 'Bugün',       value: todayLeads,          color: 'text-cyan-400' },
          { label: 'Instagram',   value: sourceCounts[0].count, color: 'text-pink-400' },
          { label: 'TikTok',      value: sourceCounts[1].count, color: 'text-teal-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-3 px-4 text-center">
            <div className={`text-xl font-bold tabular-nums ${color}`}>{value}</div>
            <div className="text-[10px] text-white/30 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Main: left (sources + form) | right (data) ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Social sources visual + Form */}
        <div className="w-[380px] shrink-0 border-r border-white/8 flex flex-col overflow-y-auto">

          {/* Social sources visual */}
          <div className="p-4 border-b border-white/8 bg-black/40 shrink-0">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">Aktif Kanallar</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {sourceCounts.map(src => (
                <div key={src.name} className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl ${src.bg} border ${src.border}`}>
                  <span className={`text-[11px] font-bold ${src.color}`}>{src.abbr}</span>
                  <span className={`text-lg font-bold tabular-nums ${src.color}`}>{src.count}</span>
                  <span className="text-[8px] text-white/30">{src.name}</span>
                </div>
              ))}
            </div>
            {/* Animated flow dots */}
            <div className="flex justify-center items-center gap-3">
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.15, 0.7, 0.15], y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.28 }}
                  className="w-1 h-1 rounded-full bg-cyan-400/50"
                />
              ))}
            </div>
            <div className="text-center text-[10px] text-white/15 mt-1">veriler sisteme aktarılıyor</div>
          </div>

          {/* Form */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-violet-400 shrink-0" />
              <span className="text-sm font-semibold text-white">Sanal Anjiyo Başvurusu</span>
              <span className="ml-auto text-[10px] text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full shrink-0">Avicenna</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Ad *"><TextInput value={form.ad} onChange={set('ad')} placeholder="Mehmet" /></Field>
              <Field label="Soyad *"><TextInput value={form.soyad} onChange={set('soyad')} placeholder="Yılmaz" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Telefon *"><TextInput value={form.telefon} onChange={set('telefon')} placeholder="05xx xxx xx xx" type="tel" /></Field>
              <Field label="E-posta"><TextInput value={form.email} onChange={set('email')} placeholder="mail@..." type="email" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Yaş"><TextInput value={form.yas} onChange={set('yas')} placeholder="55" type="number" /></Field>
              <Field label="Şikayet *"><Dropdown value={form.sikayet} onChange={set('sikayet')} options={SIKAYET_OPTIONS} placeholder="Şikayetiniz" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tercih Gün"><Dropdown value={form.oncelikli_gun} onChange={set('oncelikli_gun')} options={DAYS} placeholder="Seçiniz" /></Field>
              <Field label="Tercih Saat"><Dropdown value={form.randevu_tercihi} onChange={set('randevu_tercihi')} options={TIMES} placeholder="Seçiniz" /></Field>
            </div>
            <Field label="Ek Bilgi">
              <textarea
                value={form.mesaj}
                onChange={e => set('mesaj')(e.target.value)}
                placeholder="Varsa ek notlarınız…"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
              />
            </Field>

            <button
              onClick={handleSubmit}
              disabled={!valid || submitting || submitted}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                submitted
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : valid
                  ? 'bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
              }`}
            >
              {submitted ? (
                <><CheckCircle className="w-4 h-4" />Başvuru Alındı!</>
              ) : submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />İşleniyor…</>
              ) : (
                <><Send className="w-4 h-4" />Başvuruyu Gönder</>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Disease chart + Submissions list + Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Disease distribution chart */}
          {diseaseData.length > 0 && (
            <div className="px-5 pt-4 pb-3 border-b border-white/8 shrink-0">
              <div className="text-xs font-semibold text-white/50 mb-3">Şikayet Dağılımı</div>
              <div style={{ height: Math.max(80, diseaseData.length * 28) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseData} layout="vertical" margin={{ left: 0, right: 36, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category" dataKey="name" width={110}
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                      tickLine={false} axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="bg-black/90 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs shadow-xl">
                            <div className="text-white font-semibold">{payload[0].payload.fullName}</div>
                            <div className="text-white/50">{payload[0].value} başvuru</div>
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={14} label={{ position: 'right', fontSize: 11, fill: 'rgba(255,255,255,0.4)' }}>
                      {diseaseData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.75} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Submissions list + Detail side by side */}
          <div className="flex flex-1 overflow-hidden">

            {/* Submissions list */}
            <div className="w-[260px] shrink-0 border-r border-white/8 flex flex-col overflow-hidden">
              <div className="px-3 py-2.5 border-b border-white/8 flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-white/60">Başvurular</span>
                <span className="ml-auto text-[10px] text-white/30 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full">{submissions.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {submissions.map(sub => (
                  <motion.button
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedSub(sub)}
                    className={`w-full text-left px-3 py-3 border-b border-white/5 transition-all ${
                      selectedSub?.id === sub.id
                        ? 'bg-linear-to-r from-violet-500/10 to-transparent border-l-2 border-l-violet-500/50!'
                        : 'hover:bg-white/4'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500/30 to-cyan-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white/75 shrink-0">
                        {sub.data.ad[0]}{sub.data.soyad[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{sub.data.ad} {sub.data.soyad}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[10px] font-medium ${sourceColor(sub.source)}`}>{sub.source}</span>
                          <span className="text-[9px] text-white/20">·</span>
                          <span className="text-[10px] text-white/35 truncate">{sub.data.sikayet}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/20 shrink-0">{timeAgo(sub.timestamp)}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {selectedSub ? (
                  <motion.div
                    key={selectedSub.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/8">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500/30 to-cyan-500/20 border border-white/15 flex items-center justify-center text-lg font-bold text-white/80 shrink-0">
                        {selectedSub.data.ad[0]}{selectedSub.data.soyad[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-white">{selectedSub.data.ad} {selectedSub.data.soyad}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-xs font-medium ${sourceColor(selectedSub.source)}`}>{selectedSub.source}</span>
                          <span className="text-white/20 text-xs">·</span>
                          <span className="text-xs text-white/35">
                            {selectedSub.timestamp.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <TrendingUp className="w-2.5 h-2.5" />Lead
                      </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { icon: Phone,    label: 'Telefon',      value: selectedSub.data.telefon },
                        { icon: Mail,     label: 'E-posta',      value: selectedSub.data.email || '—' },
                        { icon: Users,    label: 'Yaş',          value: selectedSub.data.yas || '—' },
                        { icon: Heart,    label: 'Şikayet',      value: selectedSub.data.sikayet },
                        { icon: Calendar, label: 'Tercih Gün',   value: selectedSub.data.oncelikli_gun || '—' },
                        { icon: Clock,    label: 'Tercih Saat',  value: selectedSub.data.randevu_tercihi || '—' },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="p-2.5 rounded-xl bg-white/4 border border-white/8">
                          <div className="flex items-center gap-1 text-white/30 mb-1">
                            <Icon className="w-2.5 h-2.5" />
                            <span className="text-[9px]">{label}</span>
                          </div>
                          <div className="text-xs text-white/75 font-medium leading-snug">{value}</div>
                        </div>
                      ))}
                    </div>

                    {selectedSub.data.mesaj && (
                      <div className="p-3 rounded-xl bg-white/4 border border-white/8 mb-3">
                        <div className="flex items-center gap-1 text-white/30 mb-1 text-[9px]">
                          <FileText className="w-2.5 h-2.5" />Ek Bilgi
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">{selectedSub.data.mesaj}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/25 transition-colors text-xs text-emerald-400 font-medium">
                        <Phone className="w-3 h-3" />Ara
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/25 hover:bg-cyan-500/25 transition-colors text-xs text-cyan-400 font-medium">
                        <CalendarCheck className="w-3 h-3" />Randevu Oluştur
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-white/15 gap-2">
                    <Users className="w-8 h-8 opacity-30" />
                    <p className="text-sm">Bir başvuru seçin</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
