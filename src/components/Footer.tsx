'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Twitter, Github, Linkedin } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Ürün',       links: ['Özellikler', 'Fiyatlandırma', 'Entegrasyonlar', 'Güncellemeler'] },
  { label: 'Şirket',     links: ['Hakkımızda', 'Blog', 'Kariyer', 'Basın'] },
  { label: 'Destek',     links: ['Dokümantasyon', 'API Referansı', 'İletişim', 'Durum'] },
]

export default function Footer() {
  const ctaRef  = useRef<HTMLDivElement>(null)
  const inView  = useInView(ctaRef, { once: true, margin: '-80px' })

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* ── CTA Section ── */}
      <div ref={ctaRef} className="relative border-t border-white/[0.06] py-28 px-6">
        {/* CTA background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 800,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Ücretsiz başlayın · Kredi kartı gerekmez
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="gradient-text">Yapay Zeka Asistanınızı</span>
            <br />
            <span className="text-white/90">Hemen Oluşturun.</span>
          </motion.h2>

          <motion.p
            className="text-white/45 mb-10 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            5 dakikada kurulum. Sonuçları anında görün.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            {/* Primary CTA — glowing border button */}
            <motion.button
              className="glow-border group relative inline-flex items-center gap-2.5 rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Inner gradient shimmer */}
              <span
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.08))' }}
              />
              <span className="relative">Ücretsiz Deneyin</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Satışla Görüş
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Footer Links ── */}
      <div className="border-t border-white/[0.06] py-14 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 text-xl font-bold gradient-text">Cloud Echo</div>
              <p className="text-sm text-white/35 leading-relaxed max-w-xs">
                Yapay zeka ile güçlendirilmiş SaaS çözümleri. Geleceği şimdi inşa ediyoruz.
              </p>
              {/* Socials */}
              <div className="mt-5 flex gap-3">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {NAV_LINKS.map((col) => (
              <div key={col.label}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                  {col.label}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/45 hover:text-white/80 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/25">
              © 2025 Cloud Echo. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-5 text-xs text-white/25">
              <a href="#" className="hover:text-white/50 transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white/50 transition-colors">Kullanım Koşulları</a>
              <a href="#" className="hover:text-white/50 transition-colors">Çerezler</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
