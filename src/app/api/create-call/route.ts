import { NextResponse } from 'next/server'

export async function POST() {
  const res = await fetch('https://api.retellai.com/v2/create-web-call', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agent_id: 'agent_2bb24fc6d219bc3659f796b798' }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Arama başlatılamadı' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ access_token: data.access_token })
}
