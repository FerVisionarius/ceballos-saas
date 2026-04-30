import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'
  const code = searchParams.get('code')

  const supabase = createClient()

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })
    if (!error) {
      // recovery y invite van a actualizar-password
      if (type === 'recovery' || type === 'invite') {
        return NextResponse.redirect(`${origin}/actualizar-password`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/actualizar-password`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}