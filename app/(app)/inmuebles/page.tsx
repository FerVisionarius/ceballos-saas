import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { Building2, Plus } from 'lucide-react'

async function getInmuebles() {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('inmuebles')
      .select('*, clientes(nombre, apellidos)')
      .eq('activo', true)
      .order('created_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

const ESTADO_COLORS: Record<string, string> = {
  en_cartera: 'bg-blue-100 text-blue-700',
  reservado:  'bg-amber-100 text-amber-700',
  vendido:    'bg-slate-100 text-slate-600',
  alquilado:  'bg-emerald-100 text-emerald-700',
}

const ESTADO_LABELS: Record<string, string> = {
  en_cartera: 'En cartera',
  reservado:  'Reservado',
  vendido:    'Vendido',
  alquilado:  'Alquilado',
}

const TIPO_LABELS: Record<string, string> = {
  piso: 'Piso', casa: 'Casa', local: 'Local',
  garaje: 'Garaje', solar: 'Solar', otro: 'Otro',
}

export default async function InmueblesPage() {
  const inmuebles = await getInmuebles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Inmuebles</h1>
          <p className="text-slate-500 mt-1">{inmuebles.length} inmuebles en cartera</p>
        </div>
        <Link href="/inmuebles/nuevo" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo inmueble
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(ESTADO_LABELS).map(([key, label]) => {
          const count = inmuebles.filter((i: any) => i.estado === key).length
          return (
            <div key={key} className={`text-xs px-3 py-1.5 rounded-full font-medium ${ESTADO_COLORS[key]}`}>
              {label} · {count}
            </div>
          )
        })}
      </div>

      {inmuebles.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Sin inmuebles todavía</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">Añade el primer inmueble para poder vincularlo a documentos.</p>
          <Link href="/inmuebles/nuevo" className="btn-primary">
            <Plus className="w-4 h-4" />
            Añadir primer inmueble
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Inmueble</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Propietario</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Precio</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inmuebles.map((i: any) => (
                  <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{i.direccion}</p>
                      <p className="text-xs text-slate-500">{i.ciudad}{i.codigo_postal ? ` · ${i.codigo_postal}` : ''}{i.referencia ? ` · Ref: ${i.referencia}` : ''}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{TIPO_LABELS[i.tipo] ?? i.tipo}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {i.clientes ? `${i.clientes.nombre} ${i.clientes.apellidos}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {i.precio_venta
                        ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(i.precio_venta)
                        : i.precio_alquiler
                        ? `${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(i.precio_alquiler)}/mes`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[i.estado]}`}>
                        {ESTADO_LABELS[i.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/inmuebles/${i.id}`} className="text-xs text-brand-600 hover:underline font-medium">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}