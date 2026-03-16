'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Clock, Calendar, ChevronRight, RefreshCw,
  Search, TrendingUp, X, Mic, ArrowLeft,
  CheckCircle, XCircle, Loader2, Star, Info,
  CalendarCheck, BookOpen, DollarSign, Ban, HelpCircle,
  PhoneOff, Globe, Hash,
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TranscriptSegment {
  role: 'agent' | 'user'
  content: string
}

interface CallAnalysis {
  call_summary?: string
  user_sentiment?: string
  agent_sentiment?: string
  call_successful?: boolean
  agent_task_completion_rating?: number
  agent_task_completion_rating_reason?: string
  custom_analysis_data?: {
    arama_amaci?: string
    randevu_bilgisi?: string
    [key: string]: string | undefined
  }
}

interface Call {
  call_id: string
  call_type?: string
  call_status: string
  start_timestamp: number
  end_timestamp?: number
  duration_ms?: number
  transcript?: string
  transcript_object?: TranscriptSegment[]
  call_analysis?: CallAnalysis
  recording_url?: string
  agent_name?: string
  disconnect_reason?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(ms?: number, start?: number, end?: number): string {
  const totalMs = ms ?? (end && start ? end - start : undefined)
  if (!totalMs) return '—'
  const secs = Math.floor(totalMs / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatDate(ts: number, short = false): string {
  if (short) {
    return new Date(ts).toLocaleString('tr-TR', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit',
    })
  }
  return new Date(ts).toLocaleString('tr-TR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function sentimentStyle(s?: string) {
  if (s === 'Positive') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  if (s === 'Negative') return 'text-red-400 bg-red-400/10 border-red-400/20'
  return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
}

function sentimentLabel(s?: string) {
  if (s === 'Positive') return 'Olumlu'
  if (s === 'Negative') return 'Olumsuz'
  if (s === 'Neutral') return 'Nötr'
  return s || '—'
}

const INTENT_CONFIG: Record<string, { color: string; Icon: React.ElementType }> = {
  'Randevu Oluşturdu': { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', Icon: CalendarCheck },
  'Bilgi Aldı':        { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',         Icon: BookOpen },
  'Fiyat Öğrendi':     { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',   Icon: DollarSign },
  'Randevu İptali':    { color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',   Icon: Ban },
  'Diğer':             { color: 'text-white/40 bg-white/5 border-white/10',                Icon: HelpCircle },
}

function IntentBadge({ intent, sm = false }: { intent: string; sm?: boolean }) {
  const cfg = INTENT_CONFIG[intent] ?? INTENT_CONFIG['Diğer']
  const Icon = cfg.Icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${cfg.color} ${sm ? 'text-[11px]' : ''}`}>
      <Icon className={sm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {intent}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}`}
        />
      ))}
    </div>
  )
}

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${className}`}>
      {children}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Call | null>(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loadCalls = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/calls')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCalls(data.calls ?? [])
    } catch {
      setError('Aramalar yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCalls() }, [loadCalls])

  // ── Stats ──
  const today = new Date().toDateString()
  const todayCount = calls.filter(c => new Date(c.start_timestamp).toDateString() === today).length
  const endedCalls = calls.filter(c => c.call_status === 'ended')
  const totalMs = endedCalls.reduce((a, c) => a + (c.duration_ms ?? ((c.end_timestamp ?? 0) - c.start_timestamp)), 0)
  const avgSecs = endedCalls.length ? Math.floor(totalMs / endedCalls.length / 1000) : 0
  const avgDur = `${Math.floor(avgSecs / 60)}:${String(avgSecs % 60).padStart(2, '0')}`
  const randevuCount = calls.filter(c => c.call_analysis?.custom_analysis_data?.arama_amaci === 'Randevu Oluşturdu').length

  const filtered = calls.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    const intent = c.call_analysis?.custom_analysis_data?.arama_amaci ?? ''
    const summary = c.call_analysis?.call_summary ?? ''
    const appt = c.call_analysis?.custom_analysis_data?.randevu_bilgisi ?? ''
    return c.transcript?.toLowerCase().includes(q)
      || summary.toLowerCase().includes(q)
      || intent.toLowerCase().includes(q)
      || appt.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ── Header ── */}
      <header className="flex-shrink-0 flex items-center gap-4 px-5 py-3 border-b border-white/10">
        <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </Link>
        <div className="w-px h-4 bg-white/15" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
            <Phone className="w-3 h-3 text-cyan-400" />
          </div>
          <span className="font-semibold text-sm">Arama Geçmişi</span>
          <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            Avicenna · Ayşe
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {!loading && (
            <span className="text-xs text-white/30">{calls.length} arama</span>
          )}
          <button
            onClick={loadCalls}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Yenile
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Call List ── */}
        <div className="w-[420px] flex-shrink-0 border-r border-white/10 flex flex-col">

          {/* Stats bar */}
          <div className="grid grid-cols-4 border-b border-white/10 divide-x divide-white/10 flex-shrink-0">
            {[
              { label: 'Toplam',    value: calls.length,  Icon: Phone },
              { label: 'Bugün',     value: todayCount,    Icon: Calendar },
              { label: 'Randevu',   value: randevuCount,  Icon: CalendarCheck },
              { label: 'Ort. Süre', value: avgDur,        Icon: Clock },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="py-3 px-2 text-center">
                <div className="text-lg font-semibold tabular-nums">{value}</div>
                <div className="flex items-center justify-center gap-1 mt-0.5 text-[11px] text-white/35">
                  <Icon className="w-2.5 h-2.5" />
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="p-2.5 border-b border-white/10 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Transkript, niyet veya özette ara…"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-2 h-32 text-white/30 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />Yükleniyor…
              </div>
            )}
            {error && (
              <div className="p-5 text-center">
                <XCircle className="w-7 h-7 text-red-400/60 mx-auto mb-2" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex items-center justify-center h-32 text-white/25 text-sm">
                {search ? 'Sonuç yok' : 'Henüz arama kaydı yok'}
              </div>
            )}

            {filtered.map((call, i) => {
              const isSelected = selected?.call_id === call.call_id
              const intent = call.call_analysis?.custom_analysis_data?.arama_amaci
              const lastLine = call.transcript_object?.at(-1)?.content
              return (
                <motion.button
                  key={call.call_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(call)}
                  className={`w-full text-left p-3.5 border-b border-white/5 transition-all hover:bg-white/5 ${
                    isSelected ? 'bg-cyan-500/8 border-l-2 !border-l-cyan-500/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      call.call_status === 'ended' ? 'bg-white/8' : 'bg-green-500/20'
                    }`}>
                      <Phone className={`w-3.5 h-3.5 ${call.call_status === 'ended' ? 'text-white/50' : 'text-green-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-medium">{formatDate(call.start_timestamp, true)}</span>
                        <span className="text-xs text-white/30 tabular-nums flex-shrink-0">
                          {formatDuration(call.duration_ms, call.start_timestamp, call.end_timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {intent && <IntentBadge intent={intent} sm />}
                        {call.call_analysis?.user_sentiment && (
                          <Badge className={`${sentimentStyle(call.call_analysis.user_sentiment)} text-[11px]`}>
                            {sentimentLabel(call.call_analysis.user_sentiment)}
                          </Badge>
                        )}
                        {call.call_analysis?.call_successful !== undefined && (
                          <Badge className={call.call_analysis.call_successful
                            ? 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20'
                            : 'text-red-400 bg-red-400/8 border-red-400/20'
                          }>
                            {call.call_analysis.call_successful
                              ? <><CheckCircle className="w-2.5 h-2.5" />Başarılı</>
                              : <><XCircle className="w-2.5 h-2.5" />Başarısız</>}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                  </div>
                  {lastLine && (
                    <p className="text-xs text-white/30 mt-1.5 ml-[42px] line-clamp-1 italic">
                      &ldquo;{lastLine}&rdquo;
                    </p>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Right: Detail Panel ── */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.call_id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.18 }}
                className="p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-white">{formatDate(selected.start_timestamp)}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={selected.call_status === 'ended'
                        ? 'bg-white/8 text-white/50 border-white/10'
                        : 'bg-green-500/15 text-green-400 border-green-400/20'
                      }>
                        {selected.call_status === 'ended'
                          ? <><PhoneOff className="w-3 h-3" />Tamamlandı</>
                          : <><Phone className="w-3 h-3" />Devam Ediyor</>}
                      </Badge>
                      {selected.call_type && (
                        <Badge className="bg-white/5 text-white/40 border-white/10">
                          <Globe className="w-3 h-3" />
                          {selected.call_type === 'web_call' ? 'Web Araması' : selected.call_type}
                        </Badge>
                      )}
                      <Badge className="bg-white/5 text-white/50 border-white/10">
                        <Clock className="w-3 h-3" />
                        {formatDuration(selected.duration_ms, selected.start_timestamp, selected.end_timestamp)}
                      </Badge>
                      {selected.call_analysis?.call_successful !== undefined && (
                        <Badge className={selected.call_analysis.call_successful
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20'
                          : 'bg-red-500/10 text-red-400 border-red-400/20'
                        }>
                          {selected.call_analysis.call_successful
                            ? <><CheckCircle className="w-3 h-3" />Başarılı</>
                            : <><XCircle className="w-3 h-3" />Başarısız</>}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* ── Intent & Appointment ── */}
                {selected.call_analysis?.custom_analysis_data && (
                  <div className="mb-4 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/15">
                    <div className="flex items-center gap-2 mb-3 text-xs font-medium text-cyan-400/70 uppercase tracking-wide">
                      <CalendarCheck className="w-3.5 h-3.5" />
                      Arama Niyeti
                    </div>
                    {selected.call_analysis.custom_analysis_data.arama_amaci && (
                      <div className="mb-2">
                        <IntentBadge intent={selected.call_analysis.custom_analysis_data.arama_amaci} />
                      </div>
                    )}
                    {selected.call_analysis.custom_analysis_data.randevu_bilgisi && (
                      <div className="mt-2 text-sm text-white/70 bg-white/5 rounded-lg px-3 py-2 border border-white/8">
                        <span className="text-xs text-white/35 block mb-0.5">Randevu Bilgisi</span>
                        {selected.call_analysis.custom_analysis_data.randevu_bilgisi}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Call Analysis ── */}
                {selected.call_analysis && (
                  <div className="mb-4 p-4 bg-white/4 rounded-xl border border-white/8">
                    <div className="flex items-center gap-2 mb-3 text-xs font-medium text-white/40 uppercase tracking-wide">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      Arama Analizi
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {selected.call_analysis.user_sentiment && (
                        <div>
                          <div className="text-xs text-white/30 mb-1">Hasta Duygu Durumu</div>
                          <Badge className={sentimentStyle(selected.call_analysis.user_sentiment)}>
                            {sentimentLabel(selected.call_analysis.user_sentiment)}
                          </Badge>
                        </div>
                      )}
                      {selected.call_analysis.agent_sentiment && (
                        <div>
                          <div className="text-xs text-white/30 mb-1">Asistan Duygu Durumu</div>
                          <Badge className={sentimentStyle(selected.call_analysis.agent_sentiment)}>
                            {sentimentLabel(selected.call_analysis.agent_sentiment)}
                          </Badge>
                        </div>
                      )}
                      {selected.call_analysis.agent_task_completion_rating !== undefined && (
                        <div>
                          <div className="text-xs text-white/30 mb-1.5">Görev Tamamlama</div>
                          <StarRating rating={selected.call_analysis.agent_task_completion_rating} />
                        </div>
                      )}
                    </div>

                    {selected.call_analysis.agent_task_completion_rating_reason && (
                      <div className="mb-3 p-2.5 bg-white/5 rounded-lg border border-white/8">
                        <div className="text-xs text-white/30 mb-1">Değerlendirme Notu</div>
                        <p className="text-sm text-white/65 leading-relaxed">
                          {selected.call_analysis.agent_task_completion_rating_reason}
                        </p>
                      </div>
                    )}

                    {selected.call_analysis.call_summary && (
                      <div className="pt-3 border-t border-white/8">
                        <div className="text-xs text-white/30 mb-1.5">Arama Özeti</div>
                        <p className="text-sm text-white/70 leading-relaxed">
                          {selected.call_analysis.call_summary}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Technical Metadata ── */}
                <div className="mb-4 p-4 bg-white/3 rounded-xl border border-white/8">
                  <div className="flex items-center gap-2 mb-3 text-xs font-medium text-white/40 uppercase tracking-wide">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    Teknik Detaylar
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 text-sm">
                    <div>
                      <div className="text-xs text-white/30">Arama ID</div>
                      <div className="text-white/50 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                        <Hash className="w-3 h-3" />{selected.call_id}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/30">Başlangıç</div>
                      <div className="text-white/55 text-xs mt-0.5">
                        {new Date(selected.start_timestamp).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    {selected.end_timestamp && (
                      <div>
                        <div className="text-xs text-white/30">Bitiş</div>
                        <div className="text-white/55 text-xs mt-0.5">
                          {new Date(selected.end_timestamp).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    )}
                    {selected.duration_ms && (
                      <div>
                        <div className="text-xs text-white/30">Süre</div>
                        <div className="text-white/55 text-xs mt-0.5">
                          {selected.duration_ms.toLocaleString('tr-TR')} ms
                          {' · '}{formatDuration(selected.duration_ms)}
                        </div>
                      </div>
                    )}
                    {selected.call_type && (
                      <div>
                        <div className="text-xs text-white/30">Arama Türü</div>
                        <div className="text-white/55 text-xs mt-0.5">{selected.call_type}</div>
                      </div>
                    )}
                    {selected.disconnect_reason && (
                      <div>
                        <div className="text-xs text-white/30">Kapanış Sebebi</div>
                        <div className="text-white/55 text-xs mt-0.5">{selected.disconnect_reason}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Transcript ── */}
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-medium text-white/40 uppercase tracking-wide">
                    <Mic className="w-3.5 h-3.5 text-cyan-400" />
                    Konuşma Transkripti
                    {selected.transcript_object && (
                      <span className="text-white/25 normal-case font-normal">
                        ({selected.transcript_object.length} tur)
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 pb-8">
                    {selected.transcript_object?.map((seg, i) => {
                      const isAgent = seg.role === 'agent'
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.015 }}
                          className={`flex gap-2.5 ${isAgent ? 'flex-row-reverse' : ''}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                            isAgent ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/50'
                          }`}>
                            {isAgent ? 'A' : 'H'}
                          </div>
                          <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isAgent
                              ? 'bg-cyan-500/12 text-white/85 rounded-tr-sm'
                              : 'bg-white/8 text-white/75 rounded-tl-sm'
                          }`}>
                            {seg.content}
                          </div>
                        </motion.div>
                      )
                    })}
                    {(!selected.transcript_object || selected.transcript_object.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-12 text-white/20">
                        <Mic className="w-8 h-8 mb-3 opacity-40" />
                        <p className="text-sm">Transkript mevcut değil</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-white/20"
              >
                <Phone className="w-10 h-10 opacity-30" />
                <p className="text-sm">Detayları görmek için bir arama seçin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
