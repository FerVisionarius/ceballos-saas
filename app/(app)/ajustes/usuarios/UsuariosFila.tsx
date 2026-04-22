'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const ROL_COLORS: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  comercial: 'bg-emerald-100 text-emerald-700',
  readonly: 'bg-slate-100 text-slate-600',
}

export function UsuariosFila({ usuario, currentUserId }: { usuario: any; currentUserId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const esYoMismo = usuario.id === currentUserId

  async function handleEliminar() {
    if (!confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellidos}? Esta acción no se puede deshacer.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/usuarios/${usuario.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al eliminar el usuario')
      } else {
        toast.success(`Usuario ${usuario.nombre} eliminado`)
        router.refresh()
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4 px-5 py-3">
      <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-brand-700">{usuario.nombre?.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">{usuario.nombre} {usuario.apellidos}</p>
        <p className="text-xs text-slate-500">{usuario.email}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROL_COLORS[usuario.rol] ?? 'bg-slate-100 text-slate-600'}`}>
          {usuario.rol}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${usuario.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {usuario.activo ? 'Activo' : 'Inactivo'}
        </span>
        {!esYoMismo && (
          <button onClick={handleEliminar} disabled={loading}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  )
}