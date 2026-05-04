import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://gestion-ceballos.serversvisionarius.com'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const code = searchParams.get('code')

  const supabase = createClient()

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })
    if (!error) {
      if (type === 'recovery' || type === 'invite') {
        return NextResponse.redirect(`${BASE_URL}/actualizar-password`)
      }
      return NextResponse.redirect(`${BASE_URL}/dashboard`)
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${BASE_URL}/actualizar-password`)
    }
  }

  return NextResponse.redirect(`${BASE_URL}/login`)
}