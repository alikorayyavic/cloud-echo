'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Calendar, Clock, Building2 } from 'lucide-react'
import { RetellWebClient } from 'retell-client-js-sdk'

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended'

export default function AvicennaDemoSection() {
  const [status, setStatus]           = useState<CallStatus>('idle')
  const [isAgentTalking, setIsAgentTalking] = useState(false)
  const [isMeTalking, setIsMeTalking] = useState(false)
  const clientRef = useRef<InstanceType<typeof RetellWebClient> | null>(null)

  useEffect(() => {
    return () => { clientRef.current?.stopCall() }
  }, [])

  async function startCall() {
    setStatus('connecting')
    try {
      const res = await fetch('/api/create-call', { method: 'POST' })
      const { access_token, error } = await res.json()
      if (error || !access_token) throw new Error(error)

      const client = new RetellWebClient()
      clientRef.current = client

      client.on('call_started',        () => setStatus('active'))
      client.on('call_ended',          () => { setStatus('ended'); setTimeout(() => setStatus('idle'), 2500) })
      client.on('agent_start_talking', () => setIsAgentTalking(true))
      client.on('agent_stop_talking',  () => setIsAgentTalking(false))
      client.on('user_start_talking',  () => setIsMeTalking(true))
      client.on('user_stop_talking',   () => setIsMeTalking(false))
      client.on('error',               () => setStatus('idle'))

      await client.startCall({ accessToken: access_token })
    } catch {
      setStatus('idle')
    }
  }

  function endCall() {
    clientRef.current?.stopCall()
    setStatus('idle')
    setIsAgentTalking(false)
    setIsMeTalking(false)
  }

  const isActive = status === 'active'

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/70 mb-3">
            Canlı Demo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="text-white/90">AI Sesli Asistanı</span>{' '}
            <span className="gradient-text">Şimdi Deneyin</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Avicenna Hastanesi'nin AI randevu asistanı Ayşe ile gerçek bir görüşme yapın.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Left — info card */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-7"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/85">Avicenna Hastanesi</p>
                <p className="text-xs text-white/35">AI Randevu Asistanı</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: Calendar, label: 'Randevu oluşturma ve takvim kontrolü' },
                { icon: Clock,    label: 'Çalışma saatleri: Hft içi 08:30–17:00' },
                { icon: Phone,    label: 'Sanal Anjiyo bilgi ve fiyat danışma' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-white/40" />
                  </div>
                  <p className="text-xs text-white/50">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <p className="text-[11px] text-white/25">
                Bu bir demo görüşmedir. Mikrofon izni gereklidir.
              </p>
            </div>
          </motion.div>

          {/* Right — call UI */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-7 flex flex-col items-center gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Avatar with pulse rings */}
            <div className="relative flex items-center justify-center">
              {/* Pulse rings when active */}
              {isActive && (
                <>
                  <motion.div
                    className="absolute rounded-full border border-cyan-500/20"
                    animate={{ width: [80, 130], height: [80, 130], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute rounded-full border border-cyan-500/15"
                    animate={{ width: [80, 160], height: [80, 160], opacity: [0.4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                  />
                </>
              )}

              {/* Avatar circle */}
              <motion.div
                className="relative w-20 h-20 rounded-full border-2 flex items-center justify-center"
                animate={{
                  borderColor: isAgentTalking ? 'rgba(6,182,212,0.8)' : isActive ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.03)',
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-3xl select-none">👩‍⚕️</span>
              </motion.div>
            </div>

            {/* Status text */}
            <div className="text-center">
              <p className="text-sm font-semibold text-white/80 mb-1">Ayşe</p>
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-white/30">Aramak için butona basın</motion.p>
                )}
                {status === 'connecting' && (
                  <motion.p key="conn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-cyan-400/70 flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Bağlanıyor...
                  </motion.p>
                )}
                {status === 'active' && (
                  <motion.p key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-emerald-400 flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isAgentTalking ? 'Konuşuyor...' : isMeTalking ? 'Sizi dinliyor...' : 'Çevrimiçi'}
                  </motion.p>
                )}
                {status === 'ended' && (
                  <motion.p key="ended" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-white/30">Görüşme sonlandı</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Sound wave bars (visible when talking) */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  key="wave"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 h-8"
                >
                  {Array.from({ length: 7 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full bg-cyan-400/60"
                      animate={isAgentTalking || isMeTalking
                        ? { height: [4, 20 + Math.random() * 12, 4] }
                        : { height: 4 }
                      }
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Call button */}
            {status === 'idle' || status === 'ended' ? (
              <motion.button
                onClick={startCall}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="glow-border inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-black text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" />
                Aramayı Başlat
              </motion.button>
            ) : status === 'connecting' ? (
              <button disabled className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-white/40 cursor-not-allowed">
                <span className="w-4 h-4 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                Bağlanıyor...
              </button>
            ) : (
              <motion.button
                onClick={endCall}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <PhoneOff className="h-4 w-4" />
                Aramayı Bitir
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
