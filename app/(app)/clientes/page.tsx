import Link from 'next/link'
import { Users, Plus, Search } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function getClientes() {
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
          <p className="text-slate-500 mt-1">{clientes.length} clientes registrados</p>
        </div>
        <Link href="/clientes/nuevo" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo cliente
        </Link>
      </div>

      {clientes.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Sin clientes todavía</h3>
          <p className="text-sm text-slate-500 mb-6">Añade tu primer cliente para poder generar documentos.</p>
          <Link href="/clientes/nuevo" className="btn-primary">
            <Plus className="w-4 h-4" />
            Añadir primer cliente
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">NIF/NIE</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Teléfono</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Ciudad</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientes.map((cliente: any) => (
                  <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-brand-700">
                            {cliente.nombre.charAt(0)}{cliente.apellidos.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">
                          {cliente.nombre} {cliente.apellidos}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{cliente.nif_nie ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{cliente.telefono ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{cliente.email ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{cliente.ciudad ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/clientes/${cliente.id}`}
                        className="text-xs text-brand-600 hover:underline font-medium"
                      >
                        Ver
                      </Link>
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
