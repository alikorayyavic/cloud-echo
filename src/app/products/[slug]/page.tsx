'use client'

import { useParams, notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

/* ────────────────────────────────── Product Data ── */
const PRODUCTS = {
  'read-answer-agent': {
    symbol:   '◉',
    color:    '#06b6d4',
    bg:       '#042a33',
    title:    'Read & Answer Agent',
    subtitle: 'Veritabanı ve LLM Tabanlı Soru-Cevap Asistanı',
    description:
      'Şirket veritabanlarınıza ve belgelerinize doğal dil ile soru sorun. Büyük dil modelleri ile güçlendirilmiş AI ajanı, verilerinizi anlık olarak okuyup yorumlar ve size doğru, bağlamsal yanıtlar sunar.',
    features: [
      { title: 'Doğal Dil Sorgulama',   desc: 'SQL bilgisi gerektirmeden veritabanınıza soru sorabilirsiniz.' },
      { title: 'Çoklu Kaynak Desteği',  desc: 'SQL, NoSQL, PDF, Excel ve API kaynaklarından eş zamanlı veri okuma.' },
      { title: 'Bağlamsal Yanıtlar',    desc: 'LLM entegrasyonu ile sadece veri değil, anlam ve yorum sunar.' },
      { title: 'Güvenli Erişim',        desc: 'Rol tabanlı yetkilendirme ile hassas verilere kontrollü erişim.' },
    ],
    useCases: [
      { title: 'Müşteri Desteği',       desc: 'Destek ekipleri müşteri geçmişini ve siparişleri anında sorgular.' },
      { title: 'İç Bilgi Tabanı',       desc: 'Çalışanlar şirket politikalarına ve prosedürlere hızla erişir.' },
      { title: 'Satış Analitiği',       desc: 'Satış temsilcileri pipeline verilerini doğal dil ile analiz eder.' },
    ],
  },

  'worker-agent': {
    symbol:   '⚙',
    color:    '#3b82f6',
    bg:       '#0f1b3d',
    title:    'Worker Agent',
    subtitle: 'Güvenli Yetki Yapısına Sahip Aktif AI Asistanı',
    description:
      'Sadece okumakla kalmaz; veri oluşturur, günceller ve siler. Katmanlı yetkilendirme sistemi sayesinde her aksiyon kayıt altına alınır ve onay mekanizmalarıyla güvence altına alınır.',
    features: [
      { title: 'CRUD Otomasyonu',       desc: 'Oluşturma, okuma, güncelleme ve silme işlemlerini AI ile yönetin.' },
      { title: 'Onay Zincirleri',       desc: 'Kritik işlemler için çok aşamalı onay akışı tanımlayabilirsiniz.' },
      { title: 'Tam Audit Log',         desc: 'Her aksiyon kim tarafından, ne zaman yapıldı — tam şeffaflık.' },
      { title: 'Çoklu DB Desteği',      desc: 'PostgreSQL, MySQL, MongoDB ve daha fazlasıyla entegrasyon.' },
    ],
    useCases: [
      { title: 'CRM Otomasyonu',        desc: 'Müşteri kayıtlarını otomatik güncelle ve fırsatları yönet.' },
      { title: 'Veri Temizleme',        desc: 'Yinelenen ve hatalı verileri toplu olarak düzenle.' },
      { title: 'Toplu İşlemler',        desc: 'Binlerce kaydı tek komutla güvenli şekilde işle.' },
    ],
  },

  'reporter-agent': {
    symbol:   '◈',
    color:    '#8b5cf6',
    bg:       '#1a0f3d',
    title:    'Reporter Agent',
    subtitle: 'İş Zekası ve Veritabanı Tabanlı Akıllı Raporlama',
    description:
      'Veritabanlarınız ve İş Zekası platformlarınızdaki verileri otomatik olarak analiz ederek kapsamlı raporlar ve içgörüler üretir. Zamanlanmış raporları ilgili kişilere otomatik iletir.',
    features: [
      { title: 'Otomatik Rapor Üretimi', desc: 'Verilerinizden AI ile hazırlanmış profesyonel raporlar.' },
      { title: 'BI Entegrasyonu',        desc: 'Tableau, Power BI, Looker ve özel BI sistemleriyle bağlantı.' },
      { title: 'Zamanlanmış Dağıtım',   desc: 'Günlük, haftalık veya aylık raporları otomatik gönderin.' },
      { title: 'Anomali Tespiti',        desc: 'Olağandışı veri noktalarını anında tespit edip uyarı verir.' },
    ],
    useCases: [
      { title: 'Yönetici Panoları',     desc: 'C-level için otomatik haftalık performans özetleri.' },
      { title: 'Satış Raporları',       desc: 'Bölge, ürün ve temsilci bazında detaylı satış analizleri.' },
      { title: 'Operasyonel Analitik',  desc: 'Üretim ve lojistik süreçlerinde verimliliği ölç.' },
    ],
  },

  'rpa': {
    symbol:   '⬡',
    color:    '#f59e0b',
    bg:       '#2a1500',
    title:    'RPA',
    subtitle: 'Robotik Süreç Otomasyonu',
    description:
      'İnsan müdahalesi gerektiren tekrarlayan ve zaman alıcı süreçleri tam otomasyona alın. 7/24 kesintisiz çalışan robotik ajanlar iş süreçlerinizi hızlandırır, hata oranını sıfıra indirir.',
    features: [
      { title: '7/24 Çalışma',           desc: 'İnsan müdahalesi olmadan sürekli ve hatasız otomasyon.' },
      { title: 'Web & Masaüstü',         desc: 'Tarayıcı tabanlı ve masaüstü uygulamaları otomasyonu.' },
      { title: 'Form Doldurma',          desc: 'Karmaşık form akışlarını saniyeler içinde tamamlar.' },
      { title: 'Veri Transferi',         desc: 'Sistemler arası veri aktarımını hatasız gerçekleştirir.' },
    ],
    useCases: [
      { title: 'Fatura İşleme',          desc: 'Tedarikçi faturalarını otomatik okuma, eşleştirme ve kaydetme.' },
      { title: 'İK Süreçleri',           desc: 'Yeni çalışan onboarding formlarını otomatik doldurma.' },
      { title: 'Uyumluluk Raporlaması', desc: 'Düzenleyici raporları zamanında ve eksiksiz hazırlama.' },
    ],
  },

  'ai-automations': {
    symbol:   '⚡',
    color:    '#4ade80',
    bg:       '#0a2010',
    title:    'AI Automations',
    subtitle: 'n8n Tabanlı Kurumsal İş Akışı ve Otomasyon',
    description:
      'n8n altyapısı üzerine inşa edilmiş güçlü B2B ve B2C otomasyon çözümleri. Zamanlanmış görevler, tetikleyici tabanlı iş akışları ve AI destekli kararlarla süreçlerinizi otomatikleştirin.',
    features: [
      { title: 'n8n Altyapısı',          desc: '500+ entegrasyon ile güçlü ve esnek otomasyon altyapısı.' },
      { title: 'Tetikleyici Akışlar',    desc: 'Olay tabanlı tetikleyicilerle gerçek zamanlı otomasyon.' },
      { title: 'AI Karar Noktaları',     desc: 'İş akışlarına AI tabanlı koşullar ve kararlar ekleyin.' },
      { title: 'Zamanlanmış Görevler',   desc: 'Cron tabanlı periyodik görevleri dakika hassasiyetiyle çalıştırın.' },
    ],
    useCases: [
      { title: 'Lead Nurturing',         desc: 'Yeni müşteri adaylarını otomatik segmentle ve besle.' },
      { title: 'Sipariş Yönetimi',       desc: 'E-ticaret siparişlerini CRM, ERP ve lojistikle otomatik senkronize et.' },
      { title: 'Müşteri Bildirimleri',   desc: 'Davranış tabanlı kişiselleştirilmiş bildirimler gönder.' },
    ],
  },
} as const

type ProductSlug = keyof typeof PRODUCTS

/* ────────────────────────────────── Page ── */
export default function ProductPage() {
  const { slug } = useParams() as { slug: string }
  const product = PRODUCTS[slug as ProductSlug]
  if (!product) notFound()

  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 24 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ── Ambient glow ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${product.color}12 0%, transparent 70%)`,
        }}
      />

      {/* ── Subtle grid ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* ── Back link ── */}
        <motion.div {...fadeUp(0)}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors mb-14 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Ana Sayfaya Dön
          </Link>
        </motion.div>

        {/* ── Hero ── */}
        <div className="mb-20">
          {/* Icon + tag row */}
          <motion.div {...fadeUp(0.05)} className="flex items-center gap-4 mb-8">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 text-2xl font-bold backdrop-blur-sm"
              style={{
                background: product.bg,
                color:      product.color,
                boxShadow:  `0 0 30px ${product.color}30`,
              }}
            >
              {product.symbol}
            </div>
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{ color: product.color, borderColor: `${product.color}30`, background: `${product.color}10` }}
            >
              AI Ürünü
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight"
          >
            {product.title}
          </motion.h1>

          <motion.p {...fadeUp(0.15)} className="text-xl text-white/50 mb-6 font-light">
            {product.subtitle}
          </motion.p>

          <motion.p {...fadeUp(0.2)} className="text-white/40 max-w-2xl leading-relaxed text-base">
            {product.description}
          </motion.p>

          {/* CTA row */}
          <motion.div {...fadeUp(0.28)} className="flex flex-wrap gap-3 mt-10">
            <motion.button
              className="glow-border group inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Demo Talep Et
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Satışla Görüş
            </motion.button>
          </motion.div>
        </div>

        {/* ── Features ── */}
        <motion.div {...fadeUp(0.3)} className="mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-8">
            Özellikler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group relative rounded-xl border border-white/[0.07] bg-white/3 p-6 backdrop-blur-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 + i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${product.color}08, transparent)` }}
                />
                <div className="flex items-start gap-3 relative">
                  <CheckCircle2
                    className="h-4 w-4 mt-0.5 shrink-0"
                    style={{ color: product.color }}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-white/90 mb-1">{f.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Use Cases ── */}
        <motion.div {...fadeUp(0.45)} className="mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-8">
            Kullanım Senaryoları
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {product.useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                className="rounded-xl border border-white/[0.06] bg-white/2 p-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.48 + i * 0.06 }}
              >
                <div
                  className="h-px w-8 mb-4 rounded-full"
                  style={{ background: product.color }}
                />
                <h3 className="text-sm font-semibold text-white/80 mb-2">{uc.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Other products ── */}
        <motion.div {...fadeUp(0.55)}>
          <div
            className="rounded-2xl border border-white/[0.06] p-8"
            style={{ background: `linear-gradient(135deg, ${product.color}06, transparent)` }}
          >
            <h2 className="text-sm font-semibold text-white/50 mb-5">Diğer AI Çözümlerimiz</h2>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(PRODUCTS) as ProductSlug[])
                .filter((s) => s !== slug)
                .map((s) => {
                  const p = PRODUCTS[s]
                  return (
                    <Link
                      key={s}
                      href={`/products/${s}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span style={{ color: p.color }}>{p.symbol}</span>
                      {p.title}
                    </Link>
                  )
                })}
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  )
}
