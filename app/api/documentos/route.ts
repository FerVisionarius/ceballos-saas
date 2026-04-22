import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()
    const { tipo, subtipo, datos } = body

    if (!tipo || !subtipo || !datos) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Obtener perfil del usuario para incluirlo en el webhook
    const { data: perfil } = await admin
      .from('usuarios')
      .select('nombre, apellidos, email, rol')
      .eq('id', user.id)
      .single()

    // Guardar documento en Supabase
    const { data: documento, error } = await admin
      .from('documentos')
      .insert({
        tipo,
        subtipo,
        datos,
        created_by: user.id,
        cliente_id: datos.cliente_id ?? null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al guardar el documento' }, { status: 500 })

    // Enviar webhook a n8n (sin bloquear la respuesta)
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evento: 'documento_generado',
          documento_id: documento.id,
          tipo,
          subtipo,
          datos,
          usuario: {
            id: user.id,
            email: user.email,
            nombre: perfil ? `${perfil.nombre} ${perfil.apellidos}` : '',
            rol: perfil?.rol,
          },
          timestamp: new Date().toISOString(),
        }),
      }).catch(err => console.error('Error enviando webhook n8n:', err))
    }

    return NextResponse.json({
      id: documento.id,
      mensaje: 'Documento guardado correctamente',
      url_pdf: null,
    })

  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('documentos')
      .select('*, clientes(nombre, apellidos), usuarios(nombre, apellidos)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}