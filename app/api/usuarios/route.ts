import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const admin = createAdminClient()
    const { data: perfil } = await admin.from('usuarios').select('rol').eq('id', user.id).single()
    if (perfil?.rol !== 'superadmin') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })

    const { nombre, apellidos, email, rol } = await req.json()

    if (!nombre || !apellidos || !email || !rol) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    // 1. Invitar usuario — Supabase envía email automáticamente para que cree su contraseña
    const { data: authData, error: authError } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { nombre, apellidos, rol },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // 2. Crear perfil en public.usuarios
    const { error: perfilError } = await admin.from('usuarios').upsert({
      id: authData.user.id,
      email,
      nombre,
      apellidos,
      rol,
      activo: true,
    })

    if (perfilError) {
      await admin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: 'Error al crear el perfil del usuario' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: authData.user.id })

  } catch (err) {
    console.error('Error creando usuario:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const admin = createAdminClient()
    const { data } = await admin.from('usuarios').select('*').order('created_at', { ascending: false })
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}