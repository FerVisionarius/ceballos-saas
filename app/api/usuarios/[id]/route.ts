import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

async function checkSuperadmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: perfil } = await admin.from('usuarios').select('rol, id').eq('id', user.id).single()
  return perfil?.rol === 'superadmin' ? { ...perfil, userId: user.id } : null
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const superadmin = await checkSuperadmin()
    if (!superadmin) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    if (params.id === superadmin.userId) return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 })

    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error eliminando usuario:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const superadmin = await checkSuperadmin()
    if (!superadmin) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    if (params.id === superadmin.userId) return NextResponse.json({ error: 'No puedes cambiar tu propio rol' }, { status: 400 })

    const body = await req.json()
    const { rol } = body

    const rolesValidos = ['superadmin', 'admin', 'comercial', 'readonly']
    if (!rolesValidos.includes(rol)) return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('usuarios')
      .update({ rol })
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error actualizando rol:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}