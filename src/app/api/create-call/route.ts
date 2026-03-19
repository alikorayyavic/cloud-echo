import { NextResponse } from 'next/server'

function getTurkeyDate(): string {
  const now = new Date()
  const turkey = new Date(now.getTime() + 3 * 60 * 60 * 1000) // UTC+3
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
  return `${turkey.getUTCDate()} ${months[turkey.getUTCMonth()]} ${turkey.getUTCFullYear()}, ${days[turkey.getUTCDay()]}`
}

export async function POST() {
  const res = await fetch('https://api.retellai.com/v2/create-web-call', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_id: 'agent_2bb24fc6d219bc3659f796b798',
      retell_llm_dynamic_variables: { current_date: getTurkeyDate() },
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Arama başlatılamadı' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ access_token: data.access_token })
}
