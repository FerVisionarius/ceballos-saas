import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/server'
import { EliminarDocumentoBtn } from './EliminarDocumentoBtn'

async function getDocumentos() {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('documentos')
      .select('*, clientes(nombre, apellidos), usuarios(nombre, apellidos)')
      .order('created_at', { ascending: false })
      .limit(50)
    return data ?? []
  } catch {
    return []
  }
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

export default async function DocumentosPage() {
  const documentos = await getDocumentos()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documentos</h1>
          <p className="text-slate-500 mt-1">{documentos.length} documentos generados</p>
        </div>
        <Link href="/documentos/nuevo" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo documento
        </Link>
      </div>

      {documentos.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Sin documentos todavía</h3>
          <p className="text-sm text-slate-500 mb-6">Genera tu primer documento seleccionando tipo y rellenando los datos.</p>
          <Link href="/documentos/nuevo" className="btn-primary">
            <Plus className="w-4 h-4" />
            Crear primer documento
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Documento</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Generado por</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentos.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">
                          {SUBTIPO_LABELS[doc.subtipo] ?? doc.subtipo}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {doc.clientes ? `${doc.clientes.nombre} ${doc.clientes.apellidos}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {doc.usuarios ? `${doc.usuarios.nombre} ${doc.usuarios.apellidos}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/documentos/${doc.id}`} className="text-xs text-brand-600 hover:underline font-medium">
                          Ver
                        </Link>
                        <EliminarDocumentoBtn id={doc.id} />
                      </div>
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