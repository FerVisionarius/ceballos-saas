import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  let query = supabase
    .from('clientes')
    .select('*')
    .order('apellidos', { ascending: true })

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,apellidos.ilike.%${search}%,nif_nie.ilike.%${search}%`
    )
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('clientes')
    .insert({
      tratamiento: body.tratamiento,
      nombre: body.nombre,
      apellidos: body.apellidos,
      nif_nie: body.nif_nie,
      telefono: body.telefono,
      email: body.email || null,
      direccion: body.direccion || null,
      municipio: body.municipio || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}