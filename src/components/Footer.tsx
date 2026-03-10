'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Twitter, Github, Linkedin, Zap } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Ürün',   links: ['Özellikler', 'Fiyatlandırma', 'Entegrasyonlar', 'Güncellemeler'] },
  { label: 'Şirket', links: ['Hakkımızda', 'Blog', 'Kariyer', 'Basın'] },
  { label: 'Destek', links: ['Dokümantasyon', 'API Referansı', 'İletişim', 'Durum'] },
]

export default function Footer() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
      />

      <div ref={ref} className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <span className="text-base font-bold gradient-text tracking-tight">Cloud Echo</span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed max-w-xs mt-3">
                Yapay zeka ile güçlendirilmiş SaaS çözümleri. Geleceği şimdi inşa ediyoruz.
              </p>

              {/* Socials */}
              <div className="mt-5 flex gap-2.5">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-white/35 hover:text-white/70 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {NAV_LINKS.map((col, colIdx) => (
              <motion.div
                key={col.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: colIdx * 0.07 }}
              >
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/25">
                  {col.label}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/40 hover:text-white/75 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom bar */}
          <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/20">
              © 2025 Cloud Echo. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-5 text-xs text-white/20">
              <a href="#" className="hover:text-white/45 transition-colors duration-200">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white/45 transition-colors duration-200">Kullanım Koşulları</a>
              <a href="#" className="hover:text-white/45 transition-colors duration-200">Çerezler</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
