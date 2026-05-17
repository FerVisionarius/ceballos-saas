import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, CreditCard, User } from 'lucide-react'

async function getCliente(id: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export default async function ClienteDetallePage({ params }: { params: { id: string } }) {
  const cliente = await getCliente(params.id)
  if (!cliente) notFound()

  const nombreCompleto = [cliente.tratamiento, cliente.nombre, cliente.apellidos]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="space-y-6">
      <div>
        <Link href="/clientes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a clientes
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <span className="text-xl font-semibold text-brand-700">
              {cliente.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{nombreCompleto}</h1>
            <p className="text-slate-400 text-xs mt-1">ID: {cliente.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Datos personales</h2>
          <div className="space-y-3">
            {cliente.tratamiento && (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Tratamiento</p>
                  <p className="text-sm font-medium text-slate-800">{cliente.tratamiento}</p>
                </div>
              </div>
            )}
            {cliente.nif_nie && (
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">NIF / NIE</p>
                  <p className="text-sm font-medium text-slate-800">{cliente.nif_nie}</p>
                </div>
              </div>
            )}
            {cliente.telefono && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Teléfono</p>
                  <p className="text-sm font-medium text-slate-800">{cliente.telefono}</p>
                </div>
              </div>
            )}
            {cliente.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800">{cliente.email}</p>
                </div>
              </div>
            )}
            {(cliente.municipio || cliente.direccion) && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Dirección</p>
                  <p className="text-sm font-medium text-slate-800">
                    {[cliente.direccion, cliente.municipio].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-2">Información adicional</h2>
          <p className="text-xs text-slate-400">
            Cliente registrado el{' '}
            {new Date(cliente.created_at).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}