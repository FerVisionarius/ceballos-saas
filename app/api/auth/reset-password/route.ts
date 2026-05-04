import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    console.log('Reset password para:', email)
    
    const admin = createAdminClient()
    const { error } = await admin.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://gestion-ceballos.serversvisionarius.com/api/auth/callback?type=recovery',
    })

    console.log('Supabase error:', error)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}