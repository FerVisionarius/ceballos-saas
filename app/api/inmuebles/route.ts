import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()
    const admin = createAdminClient()

    const inmueble = {
      referencia:           body.referencia || null,
      tipo:                 body.tipo,
      estado:               body.estado,
      direccion:            body.direccion,
      ciudad:               body.ciudad,
      codigo_postal:        body.codigo_postal || null,
      metros_cuadrados:     body.metros_cuadrados ? parseFloat(body.metros_cuadrados) : null,
      habitaciones:         body.habitaciones ? parseInt(body.habitaciones) : null,
      banos:                body.banos ? parseInt(body.banos) : null,
      precio_venta:         body.precio_venta ? parseFloat(body.precio_venta) : null,
      precio_alquiler:      body.precio_alquiler ? parseFloat(body.precio_alquiler) : null,
      referencia_catastral: body.referencia_catastral || null,
      propietario_id:       body.propietario_id || null,
      notas:                body.notas || null,
      created_by:           user.id,
    }

    const { data, error } = await admin.from('inmuebles').insert(inmueble).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const admin = createAdminClient()
    const { data } = await admin
      .from('inmuebles')
      .select('*, clientes(nombre, apellidos)')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}