'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Clock, Calendar, ChevronRight, RefreshCw,
  Search, TrendingUp, X, Mic, ArrowLeft,
  CheckCircle, XCircle, Loader2, Star, Info,
  CalendarCheck, BookOpen, DollarSign, Ban, HelpCircle,
  PhoneOff, Globe, Hash, BarChart3, Share2,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import Link from 'next/link'
import { KPICards } from '@/components/dashboard/KPICards'
import { IntentDonutChart } from '@/components/dashboard/IntentDonutChart'
import { CallVolumeChart } from '@/components/dashboard/CallVolumeChart'
import { FunnelStats } from '@/components/dashboard/FunnelStats'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'
import { SocialTab } from '@/components/dashboard/SocialTab'

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
    randevu_onaylandi?: boolean | string
    hasta_adi_soyadi?: string
    randevu_tarihi?: string
    randevu_saati?: string
    [key: string]: string | boolean | undefined
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
        <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}`} />
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

// ─── Intent Normalization ─────────────────────────────────────────────────────

function normalizeIntent(raw: string | undefined): string {
  if (!raw) return 'Diğer'
  const t = raw.trim()
  const known = ['Randevu Oluşturdu', 'Bilgi Aldı', 'Fiyat Öğrendi', 'Randevu İptali', 'Diğer']
  if (known.includes(t)) return t
  const l = t.toLowerCase()
  if ((l.includes('randevu') || l.includes('appointment')) && !l.includes('iptal') && !l.includes('cancel')) return 'Randevu Oluşturdu'
  if (l.includes('bilgi') || l.includes('soru') || l.includes('info')) return 'Bilgi Aldı'
  if (l.includes('fiyat') || l.includes('ücret') || l.includes('maliyet')) return 'Fiyat Öğrendi'
  if (l.includes('iptal') || l.includes('cancel')) return 'Randevu İptali'
  return 'Diğer'
}

// ─── Data Derivation ──────────────────────────────────────────────────────────

function deriveData(calls: Call[]) {
  const today = new Date().toDateString()
  const todayCount = calls.filter(c => new Date(c.start_timestamp).toDateString() === today).length
  const endedCalls = calls.filter(c => c.call_status === 'ended')
  const totalMs = endedCalls.reduce((a, c) => a + (c.duration_ms ?? ((c.end_timestamp ?? 0) - c.start_timestamp)), 0)
  const avgSecs = endedCalls.length ? Math.floor(totalMs / endedCalls.length / 1000) : 0
  const avgDur = `${Math.floor(avgSecs / 60)}:${String(avgSecs % 60).padStart(2, '0')}`
  const bookedCalls = calls.filter(c => {
    const d = c.call_analysis?.custom_analysis_data
    return d?.randevu_onaylandi === true || d?.randevu_onaylandi === 'true'
  })
  const successRate = calls.length > 0 ? Math.round((bookedCalls.length / calls.length) * 100) : 0

  const intentMap: Record<string, number> = {}
  for (const c of calls) {
    const intent = normalizeIntent(c.call_analysis?.custom_analysis_data?.arama_amaci)
    intentMap[intent] = (intentMap[intent] ?? 0) + 1
  }
  const intentGroups = Object.entries(intentMap).map(([label, count]) => ({ label, count }))

  const now = Date.now()
  const DAY = 86400000
  const dailyMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * DAY)
    const key = d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
    dailyMap[key] = 0
  }
  for (const c of calls) {
    const d = new Date(c.start_timestamp)
    const key = d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
    if (key in dailyMap) dailyMap[key]++
  }
  const dailyVolume = Object.entries(dailyMap).map(([date, count]) => ({ date, count }))

  const withIntent = calls.filter(c => c.call_analysis?.custom_analysis_data?.arama_amaci).length
  const withAvailabilityCheck = calls.filter(c =>
    c.transcript?.toLowerCase().includes('müsait') ||
    c.transcript?.toLowerCase().includes('uygun') ||
    c.transcript?.toLowerCase().includes('takvim')
  ).length
  const funnelData = { total: calls.length, withIntent, withAvailabilityCheck, booked: bookedCalls.length }

  const appointments = bookedCalls.map(c => ({
    call_id: c.call_id,
    name: c.call_analysis?.custom_analysis_data?.hasta_adi_soyadi ?? '',
    date: c.call_analysis?.custom_analysis_data?.randevu_tarihi ?? '',
    time: c.call_analysis?.custom_analysis_data?.randevu_saati ?? '',
    info: c.call_analysis?.custom_analysis_data?.randevu_bilgisi ?? '',
  }))

  return { todayCount, avgDur, successRate, intentGroups, dailyVolume, funnelData, appointments }
}

// ─── Aramalar Tab ─────────────────────────────────────────────────────────────

function CallsTab({ calls, loading, error }: {
  calls: Call[]
  loading: boolean
  error: string | null
}) {
  const [selected, setSelected] = useState<Call | null>(null)
  const [search, setSearch] = useState('')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    analysis: true, technical: false, transcript: true,
  })

  // Auto-select most recent call on initial load
  const autoSelected = useRef(false)
  useEffect(() => {
    if (!autoSelected.current && calls.length > 0) {
      setSelected(calls[0])
      autoSelected.current = true
    }
  }, [calls])

  const toggleSection = (key: string) =>
    setExpandedSections(s => ({ ...s, [key]: !s[key] }))

  const today = new Date().toDateString()
  const todayCount = calls.filter(c => new Date(c.start_timestamp).toDateString() === today).length
  const endedCalls = calls.filter(c => c.call_status === 'ended')
  const totalMs = endedCalls.reduce((a, c) => a + (c.duration_ms ?? ((c.end_timestamp ?? 0) - c.start_timestamp)), 0)
  const avgSecs = endedCalls.length ? Math.floor(totalMs / endedCalls.length / 1000) : 0
  const avgDur = `${Math.floor(avgSecs / 60)}:${String(avgSecs % 60).padStart(2, '0')}`
  const randevuCount = calls.filter(c => {
    const d = c.call_analysis?.custom_analysis_data
    return d?.randevu_onaylandi === true || d?.randevu_onaylandi === 'true'
  }).length

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
    <div className="flex flex-1 overflow-hidden">
      {/* ── LEFT: Call List ── */}
      <div className="w-[380px] shrink-0 border-r border-white/8 flex flex-col bg-black">

        {/* Stats */}
        <div className="grid grid-cols-4 border-b border-white/8 divide-x divide-white/8 shrink-0">
          {[
            { label: 'Toplam', value: calls.length, Icon: Phone },
            { label: 'Bugün',  value: todayCount,   Icon: Calendar },
            { label: 'Randevu',value: randevuCount,  Icon: CalendarCheck },
            { label: 'Ort.',   value: avgDur,        Icon: Clock },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="py-2.5 px-1.5 text-center">
              <div className="text-base font-semibold tabular-nums">{value}</div>
              <div className="flex items-center justify-center gap-0.5 mt-0.5 text-[10px] text-white/30">
                <Icon className="w-2 h-2" />{label}
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="p-2.5 border-b border-white/8 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ara…"
              className="w-full bg-white/4 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 h-32 text-white/25 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />Yükleniyor…
            </div>
          )}
          {error && (
            <div className="p-5 text-center">
              <XCircle className="w-7 h-7 text-red-400/50 mx-auto mb-2" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex items-center justify-center h-32 text-white/20 text-sm">
              {search ? 'Sonuç yok' : 'Henüz arama kaydı yok'}
            </div>
          )}
          {filtered.map((call, i) => {
            const isSelected = selected?.call_id === call.call_id
            const intent = call.call_analysis?.custom_analysis_data?.arama_amaci
            const summary = call.call_analysis?.call_summary
            return (
              <motion.button
                key={call.call_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.015 }}
                onClick={() => setSelected(call)}
                className={`w-full text-left px-3.5 py-3 border-b border-white/5 transition-all group ${
                  isSelected
                    ? 'bg-linear-to-r from-cyan-500/8 to-transparent border-l-2 border-l-cyan-500/60!'
                    : 'hover:bg-white/4'
                }`}
              >
                {/* Top row */}
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                    call.call_analysis?.custom_analysis_data?.randevu_onaylandi === true || call.call_analysis?.custom_analysis_data?.randevu_onaylandi === 'true'
                      ? 'bg-emerald-500/20' : 'bg-white/6'
                  }`}>
                    <Phone className={`w-3 h-3 ${
                      call.call_analysis?.custom_analysis_data?.randevu_onaylandi === true || call.call_analysis?.custom_analysis_data?.randevu_onaylandi === 'true'
                        ? 'text-emerald-400' : 'text-white/40'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/80">{formatDate(call.start_timestamp, true)}</span>
                      <span className="text-[10px] text-white/25 tabular-nums shrink-0 ml-2">
                        {formatDuration(call.duration_ms, call.start_timestamp, call.end_timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Intent + sentiment */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap ml-9">
                  {intent && <IntentBadge intent={intent} sm />}
                  {call.call_analysis?.call_successful !== undefined && (
                    <Badge className={call.call_analysis.call_successful
                      ? 'text-emerald-400 bg-emerald-400/8 border-emerald-400/15 text-[10px]'
                      : 'text-red-400 bg-red-400/8 border-red-400/15 text-[10px]'
                    }>
                      {call.call_analysis.call_successful
                        ? <><CheckCircle className="w-2 h-2" />Başarılı</>
                        : <><XCircle className="w-2 h-2" />Başarısız</>}
                    </Badge>
                  )}
                </div>

                {/* Summary preview */}
                {summary && (
                  <p className="text-[11px] text-white/30 mt-1.5 ml-9 line-clamp-2 leading-relaxed">
                    {summary}
                  </p>
                )}

                <ChevronRight className={`absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 transition-colors ${
                  isSelected ? 'text-cyan-400/60' : 'text-white/15 group-hover:text-white/30'
                }`} />
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT: Detail ── */}
      <div className="flex-1 overflow-y-auto bg-black/60">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.call_id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full"
            >
              {/* ── Call header bar ── */}
              <div className="shrink-0 px-6 py-4 border-b border-white/8 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-white text-sm">{formatDate(selected.start_timestamp)}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={selected.call_status === 'ended'
                        ? 'bg-white/6 text-white/40 border-white/8'
                        : 'bg-green-500/15 text-green-400 border-green-400/20'
                      }>
                        {selected.call_status === 'ended'
                          ? <><PhoneOff className="w-3 h-3" />Tamamlandı</>
                          : <><Phone className="w-3 h-3" />Devam Ediyor</>}
                      </Badge>
                      {selected.call_type && (
                        <Badge className="bg-white/4 text-white/35 border-white/8">
                          <Globe className="w-3 h-3" />
                          {selected.call_type === 'web_call' ? 'Web Araması' : selected.call_type}
                        </Badge>
                      )}
                      <Badge className="bg-white/4 text-white/40 border-white/8">
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
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/35 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* ── Transcript (main area) ── */}
                <div className="flex-1 overflow-y-auto p-6 pb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Konuşma Transkripti</span>
                    {selected.transcript_object && (
                      <span className="text-white/20 text-xs">· {selected.transcript_object.length} tur</span>
                    )}
                  </div>

                  <div className="space-y-3 max-w-2xl">
                    {selected.transcript_object?.map((seg, i) => {
                      const isAgent = seg.role === 'agent'
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.012 }}
                          className={`flex gap-3 ${isAgent ? 'flex-row-reverse' : ''}`}
                        >
                          <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                            isAgent
                              ? 'bg-linear-to-br from-cyan-500/30 to-blue-500/20 text-cyan-400 border border-cyan-500/20'
                              : 'bg-white/8 text-white/45 border border-white/10'
                          }`}>
                            {isAgent ? 'A' : 'H'}
                          </div>
                          <div className={`max-w-[75%]`}>
                            <div className={`text-[10px] mb-1 ${isAgent ? 'text-right text-cyan-400/50' : 'text-white/30'}`}>
                              {isAgent ? 'Ayşe (Asistan)' : 'Hasta'}
                            </div>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isAgent
                                ? 'bg-linear-to-br from-cyan-500/15 to-blue-500/8 text-white/85 rounded-tr-sm border border-cyan-500/15'
                                : 'bg-white/7 text-white/75 rounded-tl-sm border border-white/8'
                            }`}>
                              {seg.content}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                    {(!selected.transcript_object || selected.transcript_object.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-16 text-white/15">
                        <Mic className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">Transkript mevcut değil</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Right sidebar: details ── */}
                <div className="w-72 shrink-0 border-l border-white/8 overflow-y-auto p-4 space-y-3">

                  {/* Intent */}
                  {selected.call_analysis?.custom_analysis_data && (
                    <div className="p-3.5 bg-cyan-500/5 rounded-xl border border-cyan-500/15">
                      <div className="text-[10px] font-semibold text-cyan-400/60 uppercase tracking-wide mb-2">Arama Niyeti</div>
                      {selected.call_analysis.custom_analysis_data.arama_amaci && (
                        <IntentBadge intent={selected.call_analysis.custom_analysis_data.arama_amaci} />
                      )}
                      {selected.call_analysis.custom_analysis_data.randevu_bilgisi && (
                        <div className="mt-2.5 text-xs text-white/60 bg-white/5 rounded-lg px-2.5 py-2 border border-white/8 leading-relaxed">
                          {selected.call_analysis.custom_analysis_data.randevu_bilgisi}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Analysis (collapsible) */}
                  {selected.call_analysis && (
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      <button
                        onClick={() => toggleSection('analysis')}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/4 hover:bg-white/6 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
                          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                          Analiz
                        </div>
                        {expandedSections.analysis
                          ? <ChevronUp className="w-3.5 h-3.5 text-white/25" />
                          : <ChevronDown className="w-3.5 h-3.5 text-white/25" />}
                      </button>
                      <AnimatePresence>
                        {expandedSections.analysis && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3.5 space-y-3">
                              {selected.call_analysis.user_sentiment && (
                                <div>
                                  <div className="text-[10px] text-white/25 mb-1">Hasta Duygu</div>
                                  <Badge className={sentimentStyle(selected.call_analysis.user_sentiment)}>
                                    {sentimentLabel(selected.call_analysis.user_sentiment)}
                                  </Badge>
                                </div>
                              )}
                              {selected.call_analysis.agent_task_completion_rating !== undefined && (
                                <div>
                                  <div className="text-[10px] text-white/25 mb-1.5">Görev Tamamlama</div>
                                  <StarRating rating={selected.call_analysis.agent_task_completion_rating} />
                                </div>
                              )}
                              {selected.call_analysis.agent_task_completion_rating_reason && (
                                <div className="p-2 bg-white/4 rounded-lg border border-white/8">
                                  <div className="text-[10px] text-white/25 mb-1">Değerlendirme</div>
                                  <p className="text-xs text-white/55 leading-relaxed">
                                    {selected.call_analysis.agent_task_completion_rating_reason}
                                  </p>
                                </div>
                              )}
                              {selected.call_analysis.call_summary && (
                                <div>
                                  <div className="text-[10px] text-white/25 mb-1">Özet</div>
                                  <p className="text-xs text-white/60 leading-relaxed">
                                    {selected.call_analysis.call_summary}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Technical (collapsible) */}
                  <div className="rounded-xl border border-white/8 overflow-hidden">
                    <button
                      onClick={() => toggleSection('technical')}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/4 hover:bg-white/6 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        Teknik Detaylar
                      </div>
                      {expandedSections.technical
                        ? <ChevronUp className="w-3.5 h-3.5 text-white/25" />
                        : <ChevronDown className="w-3.5 h-3.5 text-white/25" />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.technical && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3.5 grid grid-cols-1 gap-2">
                            {[
                              { label: 'Arama ID', value: selected.call_id, mono: true },
                              { label: 'Başlangıç', value: new Date(selected.start_timestamp).toLocaleString('tr-TR') },
                              selected.end_timestamp ? { label: 'Bitiş', value: new Date(selected.end_timestamp).toLocaleString('tr-TR') } : null,
                              selected.duration_ms ? { label: 'Süre', value: `${selected.duration_ms.toLocaleString('tr-TR')} ms` } : null,
                              selected.disconnect_reason ? { label: 'Kapanış', value: selected.disconnect_reason } : null,
                            ].filter(Boolean).map((item) => item && (
                              <div key={item.label}>
                                <div className="text-[10px] text-white/25">{item.label}</div>
                                <div className={`text-xs text-white/45 mt-0.5 ${item.mono ? 'font-mono text-[10px]' : ''}`}>
                                  {item.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full gap-3 text-white/15"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                <Phone className="w-7 h-7 opacity-40" />
              </div>
              <p className="text-sm">Detayları görmek için bir arama seçin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Tab = 'reports' | 'calls' | 'social'

export default function DashboardPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('reports')

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

  const overview = deriveData(calls)

  const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'reports', label: 'Raporlar',    Icon: BarChart3 },
    { id: 'calls',   label: 'Aramalar',    Icon: Phone },
    { id: 'social',  label: 'Sosyal Ağlar', Icon: Share2 },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ── Header ── */}
      <header className="shrink-0 flex items-center gap-3 px-5 py-3 border-b border-white/10">
        <Link href="/" className="flex items-center gap-1.5 text-white/35 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </Link>
        <div className="w-px h-4 bg-white/12" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
            <Phone className="w-3 h-3 text-cyan-400" />
          </div>
          <span className="font-semibold text-sm">Dashboard</span>
          <span className="text-xs text-white/35 bg-white/4 border border-white/8 px-2 py-0.5 rounded-full">
            Avicenna · Ayşe
          </span>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-0.5 ml-3 bg-white/4 rounded-xl p-1 border border-white/8">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === id
                  ? 'text-white'
                  : 'text-white/35 hover:text-white/65'
              }`}
            >
              {activeTab === id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-white/10 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {!loading && (
            <span className="text-xs text-white/25">{calls.length} arama</span>
          )}
          <button
            onClick={loadCalls}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white transition-colors disabled:opacity-35"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Yenile
          </button>
        </div>
      </header>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            {loading ? (
              <div className="flex items-center justify-center h-48 text-white/25 text-sm gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />Veriler yükleniyor…
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 text-red-400 gap-2">
                <XCircle className="w-8 h-8 opacity-50" />
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <>
                <KPICards loading={false} data={{
                  totalCalls: calls.length,
                  successRate: overview.successRate,
                  avgDuration: overview.avgDur,
                  todayCount: overview.todayCount,
                }} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <IntentDonutChart data={overview.intentGroups} />
                  <CallVolumeChart data={overview.dailyVolume} />
                </div>
                <FunnelStats data={overview.funnelData} />
                <WeeklyCalendar appointments={overview.appointments} />
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'calls' && (
          <motion.div
            key="calls"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 overflow-hidden"
          >
            <CallsTab calls={calls} loading={loading} error={error} />
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 overflow-hidden"
          >
            <SocialTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
