import { createAdminClient, createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { EditarInmuebleForm } from './EditarInmuebleForm'

async function getInmueble(id: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('inmuebles')
    .select('*, clientes(nombre, apellidos, telefono, email)')
    .eq('id', id)
    .single()
  return data
}

const ESTADO_COLORS: Record<string, string> = {
  en_cartera: 'bg-blue-100 text-blue-700',
  reservado: 'bg-amber-100 text-amber-700',
  vendido: 'bg-slate-100 text-slate-600',
  alquilado: 'bg-emerald-100 text-emerald-700',
}

const ESTADO_LABELS: Record<string, string> = {
  en_cartera: 'En cartera',
  reservado: 'Reservado',
  vendido: 'Vendido',
  alquilado: 'Alquilado',
}

const TIPO_LABELS: Record<string, string> = {
  piso: 'Piso / Apartamento', casa: 'Casa / Chalet', local: 'Local comercial',
  garaje: 'Garaje / Plaza', solar: 'Solar / Terreno', otro: 'Otro',
}

export default async function InmuebleDetallePage({ params }: { params: { id: string } }) {
  const inmueble = await getInmueble(params.id)
  if (!inmueble) notFound()

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const admin = createAdminClient()
  const { data: perfilUsuario } = await admin.from('usuarios').select('rol').eq('id', user!.id).single()
  const esSuperadmin = perfilUsuario?.rol === 'superadmin'

  return (
    <div className="space-y-6">
      <div>
        <Link href="/inmuebles" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a inmuebles
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{inmueble.direccion}</h1>
            <p className="text-slate-500 mt-1">{inmueble.ciudad}{inmueble.codigo_postal ? ` · ${inmueble.codigo_postal}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${ESTADO_COLORS[inmueble.estado]}`}>
              {ESTADO_LABELS[inmueble.estado]}
            </span>
          </div>
        </div>
      </div>

      {esSuperadmin && <EditarInmuebleForm inmueble={inmueble} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-400" />
              Datos del inmueble
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Tipo</p>
                <p className="font-medium text-slate-800">{TIPO_LABELS[inmueble.tipo] ?? inmueble.tipo}</p>
              </div>
              {inmueble.referencia && (
                <div>
                  <p className="text-slate-500">Referencia</p>
                  <p className="font-medium text-slate-800">{inmueble.referencia}</p>
                </div>
              )}
              {inmueble.metros_cuadrados && (
                <div>
                  <p className="text-slate-500">Metros cuadrados</p>
                  <p className="font-medium text-slate-800">{inmueble.metros_cuadrados} m²</p>
                </div>
              )}
              {inmueble.habitaciones && (
                <div>
                  <p className="text-slate-500">Habitaciones</p>
                  <p className="font-medium text-slate-800">{inmueble.habitaciones}</p>
                </div>
              )}
              {inmueble.banos && (
                <div>
                  <p className="text-slate-500">Baños</p>
                  <p className="font-medium text-slate-800">{inmueble.banos}</p>
                </div>
              )}
              {inmueble.referencia_catastral && (
                <div>
                  <p className="text-slate-500">Ref. catastral</p>
                  <p className="font-medium text-slate-800">{inmueble.referencia_catastral}</p>
                </div>
              )}
            </div>
          </div>

          {inmueble.notas && (
            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-2">Notas internas</h2>
              <p className="text-sm text-slate-600">{inmueble.notas}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Precios</h2>
            <div className="space-y-3">
              {inmueble.precio_venta && (
                <div>
                  <p className="text-xs text-slate-500">Precio de venta</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(inmueble.precio_venta)}
                  </p>
                </div>
              )}
              {inmueble.precio_alquiler && (
                <div>
                  <p className="text-xs text-slate-500">Precio de alquiler</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(inmueble.precio_alquiler)}/mes
                  </p>
                </div>
              )}
            </div>
          </div>

          {inmueble.clientes && (
            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-3">Propietario</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-slate-800">{inmueble.clientes.nombre} {inmueble.clientes.apellidos}</p>
                {inmueble.clientes.telefono && <p className="text-slate-500">{inmueble.clientes.telefono}</p>}
                {inmueble.clientes.email && <p className="text-slate-500">{inmueble.clientes.email}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}