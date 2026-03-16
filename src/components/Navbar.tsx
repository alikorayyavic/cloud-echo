'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = ['Ürünler', 'Fiyatlandırma', 'Hakkımızda', 'Blog']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/80 shadow-[0_1px_40px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dynext-logo.svg" alt="Dynext AI" height={36} style={{ height: 36 }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              Giriş Yap
            </a>
            <motion.a
              href="/try-it"
              className="glow-border inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Ücretsiz Deneyin
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-500 hover:text-white transition-colors p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-6 py-5"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-slate-500 hover:text-white py-2.5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2.5">
              <Link href="/dashboard" className="text-sm text-slate-500 hover:text-white py-1.5 transition-colors" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <a href="#" className="text-sm text-slate-500 hover:text-white py-1.5 transition-colors">
                Giriş Yap
              </a>
              <a
                href="/try-it"
                className="glow-border inline-flex justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Ücretsiz Deneyin
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
