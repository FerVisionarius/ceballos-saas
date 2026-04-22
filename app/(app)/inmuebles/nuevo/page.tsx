import { NuevoInmuebleForm } from './NuevoInmuebleForm'
import { createAdminClient } from '@/lib/supabase/server'

async function getClientes() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('clientes')
    .select('id, nombre, apellidos')
    .eq('activo', true)
    .order('nombre')
  return data ?? []
}

export default async function NuevoInmueblePage() {
  const clientes = await getClientes()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Nuevo inmueble</h1>
        <p className="text-slate-500 mt-1">Rellena los datos del inmueble</p>
      </div>
      <NuevoInmuebleForm clientes={clientes} />
    </div>
  )
}