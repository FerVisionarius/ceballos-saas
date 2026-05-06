import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { SCHEMA_DOCUMENTOS } from '@/lib/documentos/schema'

function procesarDatosPersonas(datos: Record<string, any>): Record<string, any> {
  const resultado: Record<string, any> = {}
  const personasExtra: Record<number, Record<string, any>> = {}

  for (const [key, value] of Object.entries(datos)) {
    const match = key.match(/^(.+)_p(\d+)$/)
    if (match) {
      const campoBase = match[1]
      const idx = parseInt(match[2])
      if (!personasExtra[idx]) personasExtra[idx] = {}
      if (value) personasExtra[idx][campoBase] = value
    } else {
      resultado[key] = value
    }
  }

  // Calcular nº de personas
  let nPersonas = 1
  for (const [idx, campos] of Object.entries(personasExtra)) {
    if (Object.values(campos).some(v => v)) {
      nPersonas = Math.max(nPersonas, parseInt(idx) + 1)
    }
  }
  resultado['numeropersonas'] = nPersonas

  // Añadir sufijo 1 a campos de persona 1
  for (const [key, value] of Object.entries(datos)) {
    if (!key.match(/_p\d+$/) && !key.startsWith('tratamiento_') && value) {
      resultado[`${key}1`] = value
    }
  }

  // Añadir tratamiento persona 1 con sufijo 1
  for (const [key, value] of Object.entries(datos)) {
    if (key.startsWith('tratamiento_') && !key.match(/_p\d+$/)) {
      resultado[`${key}1`] = value
    }
  }

  // Añadir campos personas adicionales con sufijo numérico
  for (const [idx, campos] of Object.entries(personasExtra)) {
    const num = parseInt(idx) + 1
    for (const [campo, value] of Object.entries(campos)) {
      if (value) resultado[`${campo}${num}`] = value
    }
  }

  // Tratamientos de personas adicionales
  for (const [key, value] of Object.entries(datos)) {
    const match = key.match(/^tratamiento_(.+)_p(\d+)$/)
    if (match && value) {
      const campo = match[1]
      const num = parseInt(match[2]) + 1
      resultado[`tratamiento_${campo}${num}`] = value
    }
  }

  // Construir texto del bloque {{clientes}}
  const lineasClientes: string[] = []
  for (let n = 1; n <= nPersonas; n++) {
    const tratamiento = resultado[`tratamiento_nombrecliente${n}`] ?? resultado[`tratamiento_nombrevendedor${n}`] ?? resultado[`tratamiento_nombrecomprador${n}`] ?? ''
    const nombre = resultado[`nombrecliente${n}`] ?? resultado[`nombrevendedor${n}`] ?? resultado[`nombrecomprador${n}`] ?? ''
    const municipio = resultado[`municipiocliente${n}`] ?? ''
    const calle = resultado[`callecliente${n}`] ?? ''
    const dni = resultado[`dnicliente${n}`] ?? resultado[`dnivendedor${n}`] ?? resultado[`dnicomprador${n}`] ?? ''
    const telefono = resultado[`telefonocliente${n}`] ?? ''
    const mail = resultado[`mailcliente${n}`] ?? ''

    if (nombre) {
      const parteEmail = mail ? ` y correo electrónico ${mail}` : ''
      lineasClientes.push(
        `${tratamiento} ${nombre}, con domicilio en ${municipio}, C/ ${calle} y provisto/a de D.N.I. nº ${dni}, con teléfono ${telefono}${parteEmail}`
      )
    }
  }
  resultado['clientes'] = lineasClientes.join(' y ')

  return resultado
}

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
    const def = SCHEMA_DOCUMENTOS.find(d => d.subtipo === subtipo)
    const tituloDocumento = def?.titulo ?? subtipo

    const { data: perfil } = await admin
      .from('usuarios')
      .select('nombre, apellidos, email, rol')
      .eq('id', user.id)
      .single()

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

    const datosN8n = procesarDatosPersonas(datos)

    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evento: 'documento_generado',
          documento_id: documento.id,
          tipo,
          subtipo: tituloDocumento,
          datos: datosN8n,
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