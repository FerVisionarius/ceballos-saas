import { createAdminClient, createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, User, Calendar, Tag } from 'lucide-react'
import { EditarDocumentoForm } from './EditarDocumentoForm'

async function getDocumento(id: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('documentos')
    .select('*, clientes(nombre, apellidos), usuarios(nombre, apellidos)')
    .eq('id', id)
    .single()
  return data
}

async function getRol() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data } = await admin.from('usuarios').select('rol').eq('id', user.id).single()
  return data?.rol
}

const SUBTIPO_LABELS: Record<string, string> = {
  nota_encargo_exclusiva: 'Nota encargo exclusiva',
  nota_encargo_sin_exclusiva: 'Nota encargo sin exclusiva',
  conformidad_arras_confirmatorias: 'Conformidad arras confirmatorias',
  conformidad_arras_penitenciales: 'Conformidad arras penitenciales',
  senal_arrendamiento: 'Señal arrendamiento',
  senal_compraventa_confirmatoria: 'Señal compraventa confirmatoria',
  senal_compraventa_confirmatoria_banco: 'Señal compraventa confirmatoria (banco)',
  senal_compraventa_penitencial_banco: 'Señal compraventa penitencial (banco)',
  senal_compraventa_penitencial: 'Señal compraventa penitencial',
  senal_oferta: 'Señal / Oferta',
  contrato_arras_penitencial: 'Contrato arras penitencial',
  contrato_arras_confirmatoria: 'Contrato arras confirmatoria',
  reconocimiento_honorarios: 'Reconocimiento de honorarios',
  contrato_arrendamiento: 'Contrato de arrendamiento',
  contrato_arrendamiento_rescision: 'Rescisión de arrendamiento',
}

function formatKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default async function DocumentoDetallePage({ params }: { params: { id: string } }) {
  const [doc, rol] = await Promise.all([getDocumento(params.id), getRol()])
  if (!doc) notFound()

  const esSuperadmin = rol === 'superadmin'
  const datos = doc.datos as Record<string, unknown>

  return (
    <div className="space-y-6">
      <div>
        <Link href="/documentos" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a documentos
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {SUBTIPO_LABELS[doc.subtipo] ?? doc.subtipo}
            </h1>
            <p className="text-slate-400 text-xs mt-1">ID: {doc.id}</p>
          </div>
          {doc.url_pdf && (
            <a href={doc.url_pdf} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Ver PDF
            </a>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Tipo</p>
            <p className="text-sm font-medium text-slate-800">{doc.tipo?.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Generado por</p>
            <p className="text-sm font-medium text-slate-800">
              {doc.usuarios ? `${doc.usuarios.nombre} ${doc.usuarios.apellidos}` : '—'}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Fecha</p>
            <p className="text-sm font-medium text-slate-800">
              {new Date(doc.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Vista o edición según rol */}
      {esSuperadmin ? (
        <EditarDocumentoForm id={doc.id} datosIniciales={datos} />
      ) : (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-800">Datos del documento</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(datos).map(([key, value]) =>
              value ? (
                <div key={key} className="flex items-start gap-4 px-5 py-3">
                  <p className="text-xs font-medium text-slate-500 w-48 shrink-0 pt-0.5">{formatKey(key)}</p>
                  <p className="text-sm text-slate-800">{String(value)}</p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  )
}