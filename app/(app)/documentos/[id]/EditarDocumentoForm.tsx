'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { getDefinicionDocumento } from '@/lib/documentos/schema'
import type { SeccionFormulario } from '@/types'

const SECCIONES_PERSONA = [
  'vendedor', 'comprador', 'arrendador', 'arrendatario', 'cliente',
  'avalista', 'trabajador', 'propietario', 'inquilino',
]
const CAMPOS_NOMBRE = [
  'nombrecliente', 'nombrecomprador', 'nombrevendedor',
  'nombrearrendador', 'nombrearrendatario',
  'nombrepropietario', 'nombreinquilino', 'nombreavalista', 'nombretrabajador',
]

function esCampoNombre(campoId: string) {
  return CAMPOS_NOMBRE.some(n => campoId === n || campoId.startsWith(`${n}_p`))
}

export function EditarDocumentoForm({ id, subtipo, datosIniciales }: {
  id: string
  subtipo: string
  datosIniciales: Record<string, unknown>
}) {
  const router = useRouter()
  const def = getDefinicionDocumento(subtipo)
  const [datos, setDatos] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(datosIniciales).map(([k, v]) => [
        k,
        v === true ? 'true' : v === false ? 'false' : v != null ? String(v) : '',
      ])
    )
  )
  const [loadingGuardar, setLoadingGuardar] = useState(false)
  const [loadingReenviar, setLoadingReenviar] = useState(false)

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

  // Reconvierte los "true"/"false" a booleanos para no romper las
  // comprobaciones de procesarDatosPersonas (p. ej. compartendomicilio_*).
  function datosParaGuardar() {
    return Object.fromEntries(
      Object.entries(datos).map(([k, v]) =>
        v === 'true' ? [k, true] : v === 'false' ? [k, false] : [k, v]
      )
    )
  }

  async function handleGuardar(reenviar = false) {
    reenviar ? setLoadingReenviar(true) : setLoadingGuardar(true)
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datos: datosParaGuardar(), reenviar_webhook: reenviar }),
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
  const tratClass = "w-20 shrink-0 px-2 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"

  if (!def) return null

  // ── Claves que el esquema ya pinta; el resto va a "Otros datos" ──
  const clavesRenderizadas = new Set<string>(['informacion_adicional_ia'])
  const registrarCampo = (campoId: string) => {
    clavesRenderizadas.add(campoId)
    if (esCampoNombre(campoId)) clavesRenderizadas.add(`tratamiento_${campoId}`)
  }
  def.secciones.forEach(seccion => {
    const esPersona = SECCIONES_PERSONA.includes(seccion.id)
    seccion.campos.forEach(campo => {
      registrarCampo(campo.id)
      if (esPersona && nPersonas > 1) {
        for (let idx = 1; idx <= nPersonas - 1; idx++) registrarCampo(`${campo.id}_p${idx}`)
      }
    })
  })

  const restantes = Object.keys(datos)
    .filter(k => !clavesRenderizadas.has(k))
    .sort()

  function Fila({ campoId, label, obligatorio, tipo }: {
    campoId: string; label: string; obligatorio?: boolean; tipo?: string
  }) {
    const tratKey = esCampoNombre(campoId) ? `tratamiento_${campoId}` : null
    return (
      <div className="flex items-center gap-4 px-5 py-3 border-t border-slate-100">
        <label className="text-xs font-medium text-slate-500 w-48 shrink-0">
          {label}{obligatorio && <span className="text-red-400 ml-1">*</span>}
        </label>
        {tratKey && (
          <select
            value={datos[tratKey] ?? ''}
            onChange={e => handleChange(tratKey, e.target.value)}
            className={tratClass}
          >
            <option value="">—</option>
            <option value="Don">Don</option>
            <option value="Doña">Doña</option>
          </select>
        )}
        {tipo === 'textarea' ? (
          <textarea
            value={datos[campoId] ?? ''}
            onChange={e => handleChange(campoId, e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        ) : (
          <input
            type="text"
            value={datos[campoId] ?? ''}
            onChange={e => handleChange(campoId, e.target.value)}
            className={inputClass}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-800">Editar datos del documento</h2>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Superadmin</span>
        </div>

        <div className="divide-y divide-slate-100">
          {def.secciones.map((seccion: SeccionFormulario) => {
            const esPersona = SECCIONES_PERSONA.includes(seccion.id)
            return (
              <div key={seccion.id}>
                <div className="px-5 py-3 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{seccion.titulo}</p>
                </div>

                {seccion.campos.map(campo => (
                  <Fila key={campo.id} campoId={campo.id} label={campo.label} obligatorio={campo.obligatorio} tipo={campo.tipo} />
                ))}

                {esPersona && nPersonas > 1 &&
                  Array.from({ length: nPersonas - 1 }, (_, i) => i + 1).map(idx => (
                    <div key={idx}>
                      <div className="px-5 py-2 bg-slate-50 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Persona {idx + 1}</p>
                      </div>
                      {seccion.campos.map(campo => (
                        <Fila key={`${campo.id}_p${idx}`} campoId={`${campo.id}_p${idx}`} label={campo.label} />
                      ))}
                    </div>
                  ))
                }
              </div>
            )
          })}

          {restantes.length > 0 && (
            <div>
              <div className="px-5 py-3 bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Otros datos ({restantes.length})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Campos guardados que no pertenecen a ninguna sección del formulario: tratamientos, personas extra, párrafos generados, marcas internas, etc.
                </p>
              </div>
              {restantes.map(key => {
                const valor = datos[key] ?? ''
                const multilinea = valor.length > 80 || valor.includes('\n')
                return (
                  <div key={key} className="flex items-start gap-4 px-5 py-3 border-t border-slate-100">
                    <label className="text-xs font-mono text-slate-500 w-48 shrink-0 break-all pt-2">{key}</label>
                    {multilinea ? (
                      <textarea
                        value={valor}
                        onChange={e => handleChange(key, e.target.value)}
                        rows={Math.min(10, valor.split('\n').length + Math.ceil(valor.length / 80))}
                        className={`${inputClass} resize-y`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={valor}
                        onChange={e => handleChange(key, e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Información adicional IA */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Información adicional IA</h3>
          <p className="text-xs text-slate-400 mt-0.5">Campo opcional para instrucciones o contexto adicional</p>
        </div>
        <div className="px-5 py-4">
          <textarea
            value={datos['informacion_adicional_ia'] ?? ''}
            onChange={e => handleChange('informacion_adicional_ia', e.target.value)}
            rows={4}
            placeholder="Escribe aquí cualquier información adicional..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-3 pt-1">
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
