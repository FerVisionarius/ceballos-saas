import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getSuperadminCheck() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: perfil } = await supabase.from('usuarios').select('rol').eq('id', user.id).single()
  return perfil?.rol === 'superadmin' ? perfil : null
}

export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin.from('permisos_rol').select('*').order('rol')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const superadmin = await getSuperadminCheck()
  if (!superadmin) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })

  const body = await req.json()
  const { rol, permisos } = body

  if (!rol || !permisos) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  if (rol === 'superadmin') return NextResponse.json({ error: 'No se pueden modificar los permisos de superadmin' }, { status: 403 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('permisos_rol')
    .update({ permisos })
    .eq('rol', rol)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}