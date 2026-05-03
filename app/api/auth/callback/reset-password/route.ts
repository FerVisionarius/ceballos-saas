import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const admin = createAdminClient()
  
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://gestion-ceballos.serversvisionarius.com/api/auth/callback?type=recovery',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}