import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPermisosRol } from '@/lib/permisos'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: perfil } = await admin.from('usuarios').select('rol').eq('id', user.id).single()
  if (!perfil) return NextResponse.json({ error: 'Sin perfil' }, { status: 404 })

  const permisos = await getPermisosRol(perfil.rol)
  return NextResponse.json(permisos)
}