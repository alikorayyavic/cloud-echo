# Cloud Echo — Retell AI Dashboard

Dynext AI altyapısı üzerine kurulu, Retell AI asistan aramalarını yöneten ve sosyal medya lead başvurularını takip eden premium SaaS dashboard uygulaması.

---

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| Stil | Tailwind CSS v4 |
| Animasyon | Framer Motion |
| Grafikler | Recharts |
| AI/Telefon | Retell AI REST API |
| Dil | TypeScript |

---

## Proje Yapısı

```
src/
├── app/
│   ├── page.tsx                    # Ana sayfa (Hero, Features, CTA)
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard (3 sekme) — ana dosya
│   └── api/
│       ├── calls/route.ts          # GET /api/calls — Retell'den arama listesi
│       ├── create-call/route.ts    # POST /api/create-call — yeni arama başlat
│       └── retell-variables/route.ts
│
└── components/
    └── dashboard/
        ├── KPICards.tsx            # 4 glassmorphism KPI kartı
        ├── IntentDonutChart.tsx    # Arama niyetleri pasta grafik (Recharts)
        ├── CallVolumeChart.tsx     # Günlük arama hacmi alan grafik (Recharts)
        ├── FunnelStats.tsx         # Dönüşüm hunisi (daralan bar + detay)
        ├── WeeklyCalendar.tsx      # Haftalık takvim (Retell randevuları, tıklanabilir)
        ├── AppointmentList.tsx     # Randevu listesi (yedek, aktif değil)
        └── SocialTab.tsx           # Sosyal Ağlar sekmesi (form + grafikler)
```

---

## Dashboard — Sekme Yapısı

### 📊 Raporlar
- **KPI Kartları** (4 adet): Toplam Arama / Başarı Oranı / Ortalama Süre / Bugünkü Aramalar
- **Grafikler yan yana**: Intent Donut Chart + Daily Call Volume Area Chart
- **Kullanıcı Akışı (FunnelStats)**: 4 adımlı huni, daralan bar görselleştirme, adımlar arası "X arama düştü" göstergesi, adım geçiş oranı renk kodlu badge, sağ üstte genel dönüşüm %
- **Haftalık Takvim**: Pazartesi–Pazar grid, önceki/sonraki hafta navigasyon, randevuya tıklayınca detay modal

### 📞 Aramalar
- **Sekme açılır açılmaz** en güncel arama otomatik seçilir, transkript hemen görünür
- **Sol panel** (380px): Arama listesi — tarih, süre, intent badge, başarı durumu, özet preview
- **Sağ panel**: Transkript (sohbet balonları, A=Asistan / H=Hasta) + açılır/kapanır Analiz ve Teknik Detaylar kenar paneli

### 💬 Sosyal Ağlar
- **İstatistik çubuğu**: Toplam Lead / Bugün / Instagram / TikTok sayaçları
- **Sol kolon** — Aktif Kanallar görseli (IG/TT/FB/WEB kaynak kartları + animasyonlu akış noktaları) + Sanal Anjiyo başvuru formu
  - Şikayet, Tercih Gün, Tercih Saat: özel `Dropdown` bileşeni (native select yerine — her tarayıcıda çalışır)
  - Zorunlu alanlar: Ad, Soyad, Telefon, Şikayet
- **Sağ kolon** — Şikayet dağılımı yatay bar grafik + Başvuru listesi (kaynak rengi, büyük isim) + Seçilen başvuru detay kartı

---

## Intent Normalizasyonu

`normalizeIntent()` fonksiyonu ile Retell'den gelen farklı formatlardaki arama niyeti metinleri 5 standart kategoriye düşürülür:

| Girdi örnekleri | Normalize edilmiş |
|---|---|
| "bilgi aldı", "Bilgi Aldı", "soru", "info" | Bilgi Aldı |
| "randevu oluşturdu", "Randevu Alındı", "appointment" | Randevu Oluşturdu |
| "fiyat öğrendi", "ücret sordu" | Fiyat Öğrendi |
| "iptal", "cancel" | Randevu İptali |
| diğer tüm değerler | Diğer |

---

## Retell Veri Modeli

`call.call_analysis.custom_analysis_data` alanları:

| Alan | Tip | Kullanım |
|---|---|---|
| `arama_amaci` | string | Intent grafiği (normalize edilir) |
| `randevu_onaylandi` | boolean \| "true"\|"false" | KPI, huni, takvim |
| `hasta_adi_soyadi` | string | Takvim kartı |
| `randevu_tarihi` | string (YYYY-MM-DD) | Takvim yerleştirme |
| `randevu_saati` | string (HH:MM) | Takvim detay |
| `randevu_bilgisi` | string | Randevu notu (modal) |

---

## Tasarım Sistemi

- **Tema**: Mutlak siyah arka plan (`bg-black`)
- **Cam efekti**: `bg-white/5 backdrop-blur-sm border border-white/10`
- **Accent**: Cyan (bilgi/asistan), Emerald (başarı/randevu), Violet (sosyal/form), Amber (bugün)
- **Tailwind v4 kuralları** — v3'ten farklı olan canonical sınıflar:
  - `shrink-0` (❌ `flex-shrink-0`)
  - `bg-linear-to-br` (❌ `bg-gradient-to-br`)
  - `border-l-cyan-500/60!` (❌ `!border-l-cyan-500/60`)
- **Animasyon**: Framer Motion `initial/animate/exit`, `layoutId` tab geçişi, `AnimatePresence`

---

## Ortam Değişkenleri

`.env.local` dosyasına eklenecekler:

```
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_agent_id
```

---

## Geliştirme

```bash
cd c:\Users\User\Projeler\dynext-ai\web-sitesi\cloud-echo
npm run dev
```

→ `http://localhost:3000/dashboard`

> **Not:** `C:\Users\User\Web Sitesi\cloud-echo` klasöründe eski bir kopya var — bu dizinden dev server çalıştırılmamalı.

---

## İleride Planlanıyor

- **Google Calendar entegrasyonu**: Service Account ile `alikorayyavicis@gmail.com` takvimi
  - `npm install googleapis`
  - `/api/calendar-events` route
  - `WeeklyCalendar` → `CalendarView` (react-big-calendar) yükseltmesi
  - `.env.local`'e `GOOGLE_SERVICE_ACCOUNT_KEY` eklenmesi
- **Sosyal medya webhook entegrasyonu**: Instagram/TikTok/Facebook lead formlarından gerçek veri akışı
- **Çağrı başlatma butonu**: create-call API'yi arayüze bağlama
