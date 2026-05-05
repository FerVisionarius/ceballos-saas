import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const admin = createAdminClient()
    const { data: perfil } = await admin.from('usuarios').select('rol').eq('id', user.id).single()
    if (perfil?.rol !== 'superadmin') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })

    const body = await req.json()
    const { data, error } = await admin
      .from('inmuebles')
      .update({
        referencia: body.referencia || null,
        tipo: body.tipo,
        estado: body.estado,
        direccion: body.direccion,
        ciudad: body.ciudad,
        codigo_postal: body.codigo_postal || null,
        metros_cuadrados: body.metros_cuadrados ? parseFloat(body.metros_cuadrados) : null,
        habitaciones: body.habitaciones ? parseInt(body.habitaciones) : null,
        banos: body.banos ? parseInt(body.banos) : null,
        precio_venta: body.precio_venta ? parseFloat(body.precio_venta) : null,
        precio_alquiler: body.precio_alquiler ? parseFloat(body.precio_alquiler) : null,
        referencia_catastral: body.referencia_catastral || null,
        notas: body.notas || null,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}