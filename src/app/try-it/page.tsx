'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, ArrowLeft, Zap, CheckCircle2, MessageSquare,
  Cpu, BarChart3, Bot, Send, RotateCcw, ChevronRight,
  Building2, User2, Target, Sparkles,
} from 'lucide-react'

/* ─── n8n webhook ─── */
const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? ''

/* ─── Types ─── */
interface FormData {
  templateCategory: string
  templateName:     string
  company:          string
  agentName:        string
  agentLanguage:    string
  agentPersonality: string
  goals:            string[]
  goalNotes:        string
}

type Message = { role: 'user' | 'bot'; text: string }

/* ─── Data ─── */
const CATEGORIES = [
  { id: 'qa',        label: 'Soru-Cevap',  Icon: MessageSquare, color: '#06b6d4' },
  { id: 'auto',      label: 'Otomasyon',   Icon: Cpu,           color: '#3b82f6' },
  { id: 'report',    label: 'Raporlama',   Icon: BarChart3,     color: '#8b5cf6' },
  { id: 'rpa',       label: 'RPA',         Icon: Bot,           color: '#f59e0b' },
  { id: 'workflow',  label: 'Workflow',    Icon: Zap,           color: '#4ade80' },
]

const TEMPLATES: Record<string, { name: string; desc: string }[]> = {
  qa:       [{ name: 'Müşteri Destek Asistanı',  desc: 'Müşteri sorularını 7/24 yanıtlar' },
             { name: 'Stok Sorgulama Botu',       desc: 'Anlık stok & fiyat bilgisi sağlar' }],
  auto:     [{ name: 'Sipariş İşleme Asistanı',  desc: 'Siparişleri otomatik işler ve günceller' },
             { name: 'HR Onboarding Botu',        desc: 'Yeni çalışan süreçlerini otomatikleştirir' }],
  report:   [{ name: 'Satış Rapor Asistanı',     desc: 'Günlük satış özetleri oluşturur' },
             { name: 'KPI Analiz Botu',           desc: 'Hedef ve metrikleri izler, analiz eder' }],
  rpa:      [{ name: 'Fatura Otomasyon Botu',    desc: 'Fatura form doldurmayı otomatikleştirir' },
             { name: 'Form Doldurma Robotu',      desc: 'Tekrarlayan form işlemlerini yapar' }],
  workflow: [{ name: 'Lead Akış Yöneticisi',     desc: 'n8n ile lead bildirimleri ve takip' },
             { name: 'Müşteri Bildirim Akışı',   desc: 'Tetikleyiciye göre otomatik bildirim' }],
}

const GOAL_OPTIONS = [
  'Müşteri desteği', 'Satış artırma', 'Raporlama', 'Süreç otomasyonu',
  'İç iletişim', 'Lead yönetimi', 'Veri analizi', 'Form/belge işleme',
]

const MOCK_RESPONSES = [
  'Merhaba! Size nasıl yardımcı olabilirim?',
  'Anlıyorum, bu konuda size yardımcı olabilirim.',
  'Harika bir soru! İşte size detaylı bir yanıt...',
  'Tabii ki, hemen kontrol edeyim.',
  'Bu işlemi sizin için gerçekleştiriyorum.',
]

const defaultForm: FormData = {
  templateCategory: 'qa',
  templateName:     '',
  company:          '',
  agentName:        '',
  agentLanguage:    'Türkçe',
  agentPersonality: '',
  goals:            [],
  goalNotes:        '',
}

/* ─── Stepper ─── */
const STEPS = ['Şirket', 'Ajan', 'Görev', 'Test']

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done   = current > i + 1
        const active = current === i + 1
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                  done   ? 'bg-cyan-500 border-cyan-500 text-black' :
                  active ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' :
                           'border-white/15 text-white/25 bg-transparent'
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`mt-1.5 text-[10px] tracking-wide ${active ? 'text-cyan-400' : done ? 'text-white/50' : 'text-white/20'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 h-px mx-2 mb-5 transition-colors duration-300 ${done ? 'bg-cyan-500/50' : 'bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Slide variants ─── */
function slide(dir: number) {
  return {
    initial:  { opacity: 0, x: dir * 48 },
    animate:  { opacity: 1, x: 0 },
    exit:     { opacity: 0, x: dir * -48 },
    transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }
}

/* ═══ PAGE ═══ */
export default function TryItPage() {
  const [step, setStep]   = useState<0 | 1 | 2 | 3 | 4>(0)
  const [dir,  setDir]    = useState(1)
  const [form, setForm]   = useState<FormData>(defaultForm)
  const [activeCat, setActiveCat] = useState('qa')

  /* chat state */
  const [messages,    setMessages]    = useState<Message[]>([])
  const [chatInput,   setChatInput]   = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function go(n: number) {
    setDir(n > step ? 1 : -1)
    setStep(n as 0 | 1 | 2 | 3 | 4)
  }

  function pickTemplate(name: string) {
    setForm(f => ({ ...f, templateCategory: activeCat, templateName: name }))
    go(1)
  }

  function toggleGoal(g: string) {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g],
    }))
  }

  async function sendMessage() {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setChatLoading(true)

    if (WEBHOOK_URL) {
      try {
        const res = await fetch(WEBHOOK_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ form, message: userMsg }),
        })
        const data = await res.json()
        setMessages(m => [...m, { role: 'bot', text: data.response ?? data.text ?? 'Yanıt alındı.' }])
      } catch {
        setMessages(m => [...m, { role: 'bot', text: 'Bağlantı hatası. Lütfen tekrar deneyin.' }])
      }
    } else {
      await new Promise(r => setTimeout(r, 900))
      const mock = MOCK_RESPONSES[messages.length % MOCK_RESPONSES.length]
      setMessages(m => [...m, { role: 'bot', text: mock }])
    }
    setChatLoading(false)
  }

  function reset() {
    setForm(defaultForm)
    setMessages([])
    setChatInput('')
    go(0)
  }

  /* ─── Card wrapper ─── */
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 md:p-10">
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar strip */}
      <div className="border-b border-white/[0.06] bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-sm font-bold gradient-text">Cloud Echo</span>
          </Link>
          <Link href="/" className="text-xs text-white/35 hover:text-white/70 transition-colors">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>

      {/* Background glow */}
      <div
        className="fixed pointer-events-none top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 800, height: 500,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-14">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white/90">AI Asistanınızı</span>{' '}
            <span className="gradient-text">Oluşturun</span>
          </motion.h1>
          <motion.p
            className="text-white/40 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            Birkaç adımda kendi AI asistanınızı yapılandırın ve test edin
          </motion.p>
        </div>

        {/* Stepper (steps 1–4) */}
        {step > 0 && <Stepper current={step} />}

        {/* ── Step content ── */}
        <AnimatePresence mode="wait">

          {/* STEP 0 — Template */}
          {step === 0 && (
            <motion.div key="s0" {...slide(dir)}>
              <Card>
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white/90 mb-1">Hızlı Başlangıç</h2>
                  <p className="text-sm text-white/40">Sektörünüze uygun hazır şablon seçin veya kendiniz oluşturun</p>
                </div>

                {/* Category tabs */}
                <div className="mb-5">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-3 text-center">Çözüm Alanı Seçin</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {CATEGORIES.map(({ id, label, Icon, color }) => (
                      <button
                        key={id}
                        onClick={() => setActiveCat(id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                          activeCat === id
                            ? 'border-transparent text-black'
                            : 'border-white/10 text-white/45 hover:border-white/20 hover:text-white/70'
                        }`}
                        style={activeCat === id ? { background: color } : {}}
                      >
                        <Icon className="h-3 w-3" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <AnimatePresence mode="wait">
                    {TEMPLATES[activeCat].map((t, i) => (
                      <motion.button
                        key={t.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => pickTemplate(t.name)}
                        className="group text-left rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] p-4 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors mb-1">{t.name}</p>
                            <p className="text-xs text-white/35">{t.desc}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 mt-0.5 shrink-0 transition-colors" />
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-xs text-white/25">VEYA</span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                <button
                  onClick={() => { setForm(f => ({ ...f, templateName: 'Manuel' })); go(1) }}
                  className="glow-border group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-semibold text-white"
                >
                  <Building2 className="h-4 w-4" />
                  Manuel Yapılandır
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Card>
            </motion.div>
          )}

          {/* STEP 1 — Şirket Bilgileri */}
          {step === 1 && (
            <motion.div key="s1" {...slide(dir)}>
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white/90">Firmanız Hakkında</h2>
                    <p className="text-xs text-white/35">Faaliyet alanı ve hedef kitle hakkında bilgi verin</p>
                  </div>
                </div>

                {/* Tip box */}
                <div className="mb-5 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
                  <p className="text-xs font-semibold text-cyan-400/80 mb-2">💡 İpucu</p>
                  <ul className="text-xs text-white/45 space-y-1 list-disc list-inside">
                    <li>Sektörünüzü ve ne yaptığınızı açıklayın</li>
                    <li>Hedef kitlenizi belirtin (yaş, cinsiyet, ilgi alanları)</li>
                    <li>Sunduğunuz ürün veya hizmetleri kısaca anlatın</li>
                  </ul>
                </div>

                <textarea
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 resize-none transition-colors"
                  rows={6}
                  placeholder="Örneğin: E-ticaret şirketimiz elektronik ürünleri satmaktadır. Hedef kitlemiz 20-45 yaş arası teknoloji meraklılarıdır..."
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                />

                <div className="flex gap-3 mt-6">
                  <button onClick={() => go(0)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-sm text-white/45 hover:text-white/70 hover:border-white/20 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Geri
                  </button>
                  <button
                    onClick={() => go(2)}
                    disabled={!form.company.trim()}
                    className="flex-1 glow-border group inline-flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    İleri <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 2 — Ajan Detayları */}
          {step === 2 && (
            <motion.div key="s2" {...slide(dir)}>
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <User2 className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white/90">AI Ajan Detayları</h2>
                    <p className="text-xs text-white/35">Asistanınızın kimliğini ve tonunu belirleyin</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">Ajan Adı</label>
                    <input
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-colors"
                      placeholder="Örn: Elis, Nova, Kora..."
                      value={form.agentName}
                      onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">Dil</label>
                    <div className="flex gap-2">
                      {['Türkçe', 'İngilizce', 'İkisi de'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => setForm(f => ({ ...f, agentLanguage: lang }))}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                            form.agentLanguage === lang
                              ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                              : 'border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">Kişilik / Ton <span className="text-white/20">(opsiyonel)</span></label>
                    <textarea
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 resize-none transition-colors"
                      rows={3}
                      placeholder="Örn: Profesyonel ama samimi, teknik konulara hâkim, kısa ve net yanıtlar..."
                      value={form.agentPersonality}
                      onChange={e => setForm(f => ({ ...f, agentPersonality: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => go(1)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-sm text-white/45 hover:text-white/70 hover:border-white/20 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Geri
                  </button>
                  <button
                    onClick={() => go(3)}
                    disabled={!form.agentName.trim()}
                    className="flex-1 glow-border group inline-flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    İleri <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 3 — Görev & Amaç */}
          {step === 3 && (
            <motion.div key="s3" {...slide(dir)}>
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Target className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white/90">Görev ve Amaç</h2>
                    <p className="text-xs text-white/35">Asistanınızın ne yapmasını istiyorsunuz?</p>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs text-white/40 mb-3">Görev Tipleri <span className="text-white/20">(birden fazla seçebilirsiniz)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_OPTIONS.map(g => (
                      <button
                        key={g}
                        onClick={() => toggleGoal(g)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                          form.goals.includes(g)
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                            : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                        }`}
                      >
                        {form.goals.includes(g) && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Özel Notlar <span className="text-white/20">(opsiyonel)</span></label>
                  <textarea
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 resize-none transition-colors"
                    rows={3}
                    placeholder="Özel gereksinimler, kısıtlamalar veya notlar..."
                    value={form.goalNotes}
                    onChange={e => setForm(f => ({ ...f, goalNotes: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => go(2)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-sm text-white/45 hover:text-white/70 hover:border-white/20 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Geri
                  </button>
                  <button
                    onClick={() => {
                      setMessages([{ role: 'bot', text: `Merhaba! Ben ${form.agentName || 'AI Asistanınız'}. Size nasıl yardımcı olabilirim?` }])
                      go(4)
                    }}
                    disabled={form.goals.length === 0}
                    className="flex-1 glow-border group inline-flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="h-4 w-4" />
                    Asistanı Oluştur
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 4 — Test Et */}
          {step === 4 && (
            <motion.div key="s4" {...slide(dir)}>
              {/* Summary bar */}
              <div className="mb-4 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="text-xs">
                  <span className="text-white/25">Şablon: </span>
                  <span className="text-white/60">{form.templateName}</span>
                </div>
                <div className="text-xs">
                  <span className="text-white/25">Ajan: </span>
                  <span className="text-cyan-400 font-medium">{form.agentName || 'AI Asistan'}</span>
                </div>
                <div className="text-xs">
                  <span className="text-white/25">Dil: </span>
                  <span className="text-white/60">{form.agentLanguage}</span>
                </div>
                <button onClick={reset} className="ml-auto inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
                  <RotateCcw className="h-3 w-3" /> Yeniden
                </button>
              </div>

              {/* n8n banner */}
              {!WEBHOOK_URL && (
                <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400/80 flex items-start gap-2">
                  <span className="text-base leading-none">⚡</span>
                  <span><strong>Demo modu</strong> — n8n akışı bağlandığında gerçek yanıtlar alacaksınız. Şu an örnek yanıtlar gösterilmektedir.</span>
                </div>
              )}

              {/* Chat window */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                {/* Chat header */}
                <div className="border-b border-white/[0.06] px-5 py-3.5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/85">{form.agentName || 'AI Asistan'}</p>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-white/30">Çevrimiçi</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-72 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-cyan-500/15 border border-cyan-500/20 text-white/85'
                              : 'bg-white/[0.04] border border-white/[0.07] text-white/70'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {chatLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-3 flex gap-1">
                          {[0, 0.15, 0.3].map((d, i) => (
                            <motion.span key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full"
                              animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-white/[0.06] p-3 flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 transition-colors"
                    placeholder="Bir şey sorun..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    disabled={chatLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={chatLoading || !chatInput.trim()}
                    className="glow-border inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
