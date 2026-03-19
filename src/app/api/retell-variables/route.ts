import { NextResponse } from 'next/server'

function getTurkeyDate(): string {
  const now = new Date()
  const turkey = new Date(now.getTime() + 3 * 60 * 60 * 1000) // UTC+3
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
  return `${turkey.getUTCDate()} ${months[turkey.getUTCMonth()]} ${turkey.getUTCFullYear()}, ${days[turkey.getUTCDay()]}`
}

// Retell calls this endpoint at the start of each inbound phone call.
// The returned JSON keys are substituted into {{variable}} placeholders in the LLM prompt.
export async function POST() {
  return NextResponse.json({ current_date: getTurkeyDate() })
}
