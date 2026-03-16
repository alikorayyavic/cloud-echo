import { NextRequest, NextResponse } from 'next/server'

const AGENT_ID = 'agent_2bb24fc6d219bc3659f796b798'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paginationKey = searchParams.get('page_key')
  const limit = parseInt(searchParams.get('limit') || '100')

  const body: Record<string, unknown> = {
    filter_criteria: {
      agent_id: [AGENT_ID],
    },
    sort_order: 'descending',
    limit,
  }

  if (paginationKey) {
    body.pagination_key = paginationKey
  }

  const res = await fetch('https://api.retellai.com/v2/list-calls', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Aramalar yüklenemedi' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
