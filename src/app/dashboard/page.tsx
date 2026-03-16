'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Clock, Calendar, ChevronRight,
  RefreshCw, Search, TrendingUp, X, Mic,
  ArrowLeft, CheckCircle, XCircle, Loader2,
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
}

interface Call {
  call_id: string
  call_status: string
  start_timestamp: number
  end_timestamp?: number
  transcript?: string
  transcript_object?: TranscriptSegment[]
  call_analysis?: CallAnalysis
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(start: number, end?: number): string {
  if (!end) return '—'
  const secs = Math.floor((end - start) / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function sentimentStyle(s?: string) {
  if (s === 'Positive') return 'text-emerald-400 bg-emerald-400/10'
  if (s === 'Negative') return 'text-red-400 bg-red-400/10'
  return 'text-yellow-400 bg-yellow-400/10'
}

function sentimentLabel(s?: string) {
  if (s === 'Positive') return 'Olumlu'
  if (s === 'Negative') return 'Olumsuz'
  if (s === 'Neutral') return 'Nötr'
  return s || '—'
}

// ─── Component ────────────────────────────────────────────────────────────────

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
      setError('Aramalar yüklenemedi. API anahtarını kontrol edin.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCalls()
  }, [loadCalls])

  // Stats
  const today = new Date().toDateString()
  const todayCount = calls.filter(
    (c) => new Date(c.start_timestamp).toDateString() === today,
  ).length
  const endedCalls = calls.filter((c) => c.call_status === 'ended')
  const avgSecs = endedCalls.length
    ? Math.floor(
        endedCalls.reduce(
          (acc, c) => acc + ((c.end_timestamp ?? 0) - c.start_timestamp),
          0,
        ) /
          endedCalls.length /
          1000,
      )
    : 0
  const avgDuration = `${Math.floor(avgSecs / 60)}:${String(avgSecs % 60).padStart(2, '0')}`

  const filtered = calls.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.transcript?.toLowerCase().includes(q) ||
      c.call_analysis?.call_summary?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ── Header ── */}
      <header className="flex-shrink-0 flex items-center gap-4 px-5 py-3.5 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm"
        >
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
        <div className="ml-auto">
          <button
            onClick={loadCalls}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Yenile
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel ── */}
        <div className="w-[400px] flex-shrink-0 border-r border-white/10 flex flex-col">
          {/* Stats */}
          <div className="grid grid-cols-3 border-b border-white/10 divide-x divide-white/10 flex-shrink-0">
            {[
              { label: 'Toplam', value: calls.length, Icon: Phone },
              { label: 'Bugün', value: todayCount, Icon: Calendar },
              { label: 'Ort. Süre', value: avgDuration, Icon: Clock },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="py-4 px-3 text-center">
                <div className="text-xl font-semibold tabular-nums">{value}</div>
                <div className="flex items-center justify-center gap-1 mt-0.5 text-xs text-white/40">
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="p-3 border-b border-white/10 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Transkriptte ara…"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Call List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-2 h-32 text-white/30 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Yükleniyor…
              </div>
            )}
            {error && (
              <div className="p-5 text-center">
                <XCircle className="w-8 h-8 text-red-400/60 mx-auto mb-2" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex items-center justify-center h-32 text-white/30 text-sm">
                {search ? 'Sonuç bulunamadı' : 'Henüz arama yok'}
              </div>
            )}
            {filtered.map((call, i) => {
              const isSelected = selected?.call_id === call.call_id
              const lastLine = call.transcript_object?.at(-1)?.content
              return (
                <motion.button
                  key={call.call_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(call)}
                  className={`w-full text-left p-3.5 border-b border-white/5 transition-colors hover:bg-white/5 ${
                    isSelected
                      ? 'bg-cyan-500/8 border-l-2 !border-l-cyan-500/70'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        call.call_status === 'ended'
                          ? 'bg-white/8'
                          : 'bg-green-500/20'
                      }`}
                    >
                      <Phone
                        className={`w-3.5 h-3.5 ${
                          call.call_status === 'ended'
                            ? 'text-white/50'
                            : 'text-green-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">
                          {formatDateShort(call.start_timestamp)}
                        </span>
                        <span className="text-xs text-white/35 tabular-nums flex-shrink-0">
                          {formatDuration(
                            call.start_timestamp,
                            call.end_timestamp,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {call.call_analysis?.user_sentiment && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full ${sentimentStyle(
                              call.call_analysis.user_sentiment,
                            )}`}
                          >
                            {sentimentLabel(call.call_analysis.user_sentiment)}
                          </span>
                        )}
                        {call.call_analysis?.call_successful !== undefined && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              call.call_analysis.call_successful
                                ? 'text-emerald-400 bg-emerald-400/10'
                                : 'text-red-400 bg-red-400/10'
                            }`}
                          >
                            {call.call_analysis.call_successful
                              ? 'Başarılı'
                              : 'Başarısız'}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                  </div>
                  {lastLine && (
                    <p className="text-xs text-white/35 mt-2 ml-11 line-clamp-1">
                      {lastLine}
                    </p>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.call_id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full p-6"
              >
                {/* Detail header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-base font-semibold">
                      {formatDate(selected.start_timestamp)}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-white/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(
                          selected.start_timestamp,
                          selected.end_timestamp,
                        )}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          selected.call_status === 'ended'
                            ? 'bg-white/8 text-white/50'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {selected.call_status === 'ended'
                          ? 'Tamamlandı'
                          : 'Devam Ediyor'}
                      </span>
                      {selected.call_analysis?.call_successful !== undefined && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            selected.call_analysis.call_successful
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {selected.call_analysis.call_successful ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {selected.call_analysis.call_successful
                            ? 'Başarılı'
                            : 'Başarısız'}
                        </span>
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

                {/* Analysis card */}
                {selected.call_analysis &&
                  (selected.call_analysis.user_sentiment ||
                    selected.call_analysis.call_summary) && (
                    <div className="mb-5 p-4 bg-white/4 rounded-xl border border-white/8">
                      <div className="flex items-center gap-2 mb-3 text-xs font-medium text-white/50 uppercase tracking-wide">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        Arama Analizi
                      </div>
                      {(selected.call_analysis.user_sentiment ||
                        selected.call_analysis.agent_sentiment) && (
                        <div className="flex gap-4 mb-3">
                          {selected.call_analysis.user_sentiment && (
                            <div>
                              <div className="text-xs text-white/35 mb-1">
                                Hasta duygu
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${sentimentStyle(
                                  selected.call_analysis.user_sentiment,
                                )}`}
                              >
                                {sentimentLabel(
                                  selected.call_analysis.user_sentiment,
                                )}
                              </span>
                            </div>
                          )}
                          {selected.call_analysis.agent_sentiment && (
                            <div>
                              <div className="text-xs text-white/35 mb-1">
                                Asistan duygu
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${sentimentStyle(
                                  selected.call_analysis.agent_sentiment,
                                )}`}
                              >
                                {sentimentLabel(
                                  selected.call_analysis.agent_sentiment,
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {selected.call_analysis.call_summary && (
                        <div
                          className={
                            selected.call_analysis.user_sentiment
                              ? 'pt-3 border-t border-white/8'
                              : ''
                          }
                        >
                          <div className="text-xs text-white/35 mb-1.5">
                            Özet
                          </div>
                          <p className="text-sm text-white/70 leading-relaxed">
                            {selected.call_analysis.call_summary}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {/* Transcript */}
                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-white/50 uppercase tracking-wide">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  Transkript
                </div>

                <div className="flex-1 space-y-2.5 pb-6">
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
                        <div
                          className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                            isAgent
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {isAgent ? 'A' : 'H'}
                        </div>
                        <div
                          className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isAgent
                              ? 'bg-cyan-500/12 text-white/85 rounded-tr-sm'
                              : 'bg-white/8 text-white/75 rounded-tl-sm'
                          }`}
                        >
                          {seg.content}
                        </div>
                      </motion.div>
                    )
                  })}
                  {(!selected.transcript_object ||
                    selected.transcript_object.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-16 text-white/25">
                      <Mic className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm">Transkript mevcut değil</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-white/20"
              >
                <Phone className="w-10 h-10 opacity-40" />
                <p className="text-sm">Detayları görmek için bir arama seçin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
