import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const admin = createAdminClient()
    const { data: perfil } = await admin.from('usuarios').select('rol').eq('id', user.id).single()
    if (perfil?.rol !== 'superadmin') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })

    // No permitir eliminarse a uno mismo
    if (params.id === user.id) return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 })

    // 1. Eliminar de Supabase Auth — esto también elimina de public.usuarios por el cascade
    const { error } = await admin.auth.admin.deleteUser(params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error eliminando usuario:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}