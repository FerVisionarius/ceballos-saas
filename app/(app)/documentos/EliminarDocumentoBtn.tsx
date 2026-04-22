'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function EliminarDocumentoBtn({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleEliminar() {
    if (!confirm('¿Está seguro de que desea eliminar este documento? Su eliminación no tiene reversión posible.')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/documentos/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al eliminar el documento')
      } else {
        toast.success('Documento eliminado')
        router.refresh()
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleEliminar} disabled={loading}
      className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  )
}