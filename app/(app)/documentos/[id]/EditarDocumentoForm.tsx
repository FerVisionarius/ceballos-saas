'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send, FileText } from 'lucide-react'
import { toast } from 'sonner'

function formatKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function EditarDocumentoForm({ id, datosIniciales }: { id: string; datosIniciales: Record<string, unknown> }) {
  const router = useRouter()
  const [datos, setDatos] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(datosIniciales).map(([k, v]) => [k, v ? String(v) : '']))
  )
  const [loadingGuardar, setLoadingGuardar] = useState(false)
  const [loadingReenviar, setLoadingReenviar] = useState(false)

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
        {Object.entries(datos).map(([key, value]) => (
          <div key={key} className="flex items-start gap-4 px-5 py-3">
            <label className="text-xs font-medium text-slate-500 w-48 shrink-0 pt-2.5">
              {formatKey(key)}
            </label>
            <input
              type="text"
              value={value}
              onChange={e => handleChange(key, e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button onClick={() => handleGuardar(false)} disabled={loadingGuardar || loadingReenviar}
          className="btn-secondary">
          {loadingGuardar ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : <><Save className="w-4 h-4" /> Guardar</>}
        </button>
        <button onClick={() => handleGuardar(true)} disabled={loadingGuardar || loadingReenviar}
          className="btn-primary">
          {loadingReenviar ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Guardar y reenviar</>}
        </button>
      </div>
    </div>
  )
}