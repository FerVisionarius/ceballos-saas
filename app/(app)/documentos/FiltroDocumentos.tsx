'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FileText, Search } from 'lucide-react'
import { EliminarDocumentoBtn } from './EliminarDocumentoBtn'

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

function getInmueble(datos: any): string {
  const municipio = datos?.municipioinmueble ?? ''
  const calle = datos?.calleinmueble ?? ''
  if (!municipio && !calle) return '—'
  return [municipio, calle].filter(Boolean).join(', ')
}

interface Props {
  documentos: any[]
  subtiposUnicos: string[]
}

export function FiltroDocumentos({ documentos, subtiposUnicos }: Props) {
  const [filtro, setFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const filtrados = documentos.filter((doc: any) => {
    const matchFiltro = !filtro || doc.subtipo === filtro
    const inmueble = getInmueble(doc.datos)
    const matchBusqueda = !busqueda ||
      inmueble.toLowerCase().includes(busqueda.toLowerCase()) ||
      (SUBTIPO_LABELS[doc.subtipo] ?? doc.subtipo).toLowerCase().includes(busqueda.toLowerCase())
    return matchFiltro && matchBusqueda
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por inmueble..."
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>
        <select
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="">Todos los tipos</option>
          {subtiposUnicos.map((s: string) => (
            <option key={s} value={s}>{SUBTIPO_LABELS[s] ?? s}</option>
          ))}
        </select>
        {(filtro || busqueda) && (
          <button
            onClick={() => { setFiltro(''); setBusqueda('') }}
            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg bg-white"
          >
            Limpiar
          </button>
        )}
        <span className="text-xs text-slate-400 ml-auto">
          {filtrados.length} de {documentos.length}
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Documento</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Inmueble</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Generado por</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                    No hay documentos con ese filtro
                  </td>
                </tr>
              ) : (
                filtrados.map((doc: any) => (
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
                      {getInmueble(doc.datos)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}