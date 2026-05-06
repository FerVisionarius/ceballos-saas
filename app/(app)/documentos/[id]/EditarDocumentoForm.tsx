'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { getDefinicionDocumento } from '@/lib/documentos/schema'

export function EditarDocumentoForm({ id, subtipo, datosIniciales }: { 
  id: string
  subtipo: string
  datosIniciales: Record<string, unknown> 
}) {
  const router = useRouter()
  const def = getDefinicionDocumento(subtipo)
  const [datos, setDatos] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(datosIniciales).map(([k, v]) => [k, v ? String(v) : '']))
  )
  const [loadingGuardar, setLoadingGuardar] = useState(false)
  const [loadingReenviar, setLoadingReenviar] = useState(false)

  // Detectar cuántas personas hay
  const nPersonas = (() => {
    let max = 1
    Object.keys(datosIniciales).forEach(key => {
      const match = key.match(/_p(\d+)$/)
      if (match) max = Math.max(max, parseInt(match[1]) + 1)
    })
    return max
  })()

  function handleChange(key: string, value: string) {
    setDatos(prev => ({ ...prev, [key]: value }))
  }

  async function handleGuardar(reenviar = false) {
    reenviar ? setLoadingReenviar(true) : setLoadingGuardar(true)
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datos, reenviar_webhook: reenviar }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al guardar')
      } else {
        toast.success(reenviar ? 'Documento guardado y reenviado a n8n' : 'Documento guardado correctamente')
        router.refresh()
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoadingGuardar(false)
      setLoadingReenviar(false)
    }
  }

  const inputClass = "flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"

  if (!def) return null

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-800">Editar datos del documento</h2>
        </div>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Superadmin</span>
      </div>

      <div className="divide-y divide-slate-100">
        {def.secciones.map(seccion => (
          <div key={seccion.id}>
            <div className="px-5 py-3 bg-slate-50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{seccion.titulo}</p>
            </div>

            {/* Persona 1 */}
            {seccion.campos.map(campo => (
              <div key={campo.id} className="flex items-center gap-4 px-5 py-3 border-t border-slate-100">
                <label className="text-xs font-medium text-slate-500 w-48 shrink-0">
                  {campo.label}{campo.obligatorio && <span className="text-red-400 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={datos[campo.id] ?? ''}
                  onChange={e => handleChange(campo.id, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}

            {/* Personas adicionales */}
            {['vendedor', 'comprador', 'arrendador', 'arrendatario', 'cliente'].includes(seccion.id) && nPersonas > 1 &&
              Array.from({ length: nPersonas - 1 }, (_, i) => i + 1).map(idx => (
                <div key={idx}>
                  <div className="px-5 py-2 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Persona {idx + 1}</p>
                  </div>
                  {seccion.campos.map(campo => (
                    <div key={`${campo.id}_p${idx}`} className="flex items-center gap-4 px-5 py-3 border-t border-slate-100">
                      <label className="text-xs font-medium text-slate-500 w-48 shrink-0">{campo.label}</label>
                      <input
                        type="text"
                        value={datos[`${campo.id}_p${idx}`] ?? ''}
                        onChange={e => handleChange(`${campo.id}_p${idx}`, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              ))
            }
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button onClick={() => handleGuardar(false)} disabled={loadingGuardar || loadingReenviar} className="btn-secondary">
          {loadingGuardar ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : <><Save className="w-4 h-4" /> Guardar</>}
        </button>
        <button onClick={() => handleGuardar(true)} disabled={loadingGuardar || loadingReenviar} className="btn-primary">
          {loadingReenviar ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Guardar y reenviar</>}
        </button>
      </div>
    </div>
  )
}