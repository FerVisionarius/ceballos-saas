'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, ShieldCheck, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

type Accion = 'ver' | 'crear' | 'editar' | 'eliminar'
type Modulo = 'clientes' | 'inmuebles' | 'documentos' | 'usuarios'
type PermisosModulo = Record<Accion, boolean>
type PermisosRol = Record<Modulo, PermisosModulo>

interface FilaPermisos {
  rol: string
  permisos: PermisosRol
}

const MODULOS: { id: Modulo; label: string }[] = [
  { id: 'clientes', label: 'Clientes' },
  { id: 'inmuebles', label: 'Inmuebles' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'usuarios', label: 'Usuarios' },
]

const ACCIONES: { id: Accion; label: string }[] = [
  { id: 'ver', label: 'Ver' },
  { id: 'crear', label: 'Crear' },
  { id: 'editar', label: 'Editar' },
  { id: 'eliminar', label: 'Eliminar' },
]

const ROLES_EDITABLES = ['admin', 'comercial', 'readonly']

const ETIQUETAS_ROL: Record<string, { label: string; color: string }> = {
  superadmin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
  admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
  comercial: { label: 'Comercial', color: 'bg-emerald-100 text-emerald-700' },
  readonly: { label: 'Solo lectura', color: 'bg-slate-100 text-slate-600' },
}

export default function PermisosPage() {
  const [filas, setFilas] = useState<FilaPermisos[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState<string | null>(null)

  useEffect(() => {
    cargarPermisos()
  }, [])

  async function cargarPermisos() {
    try {
      const res = await fetch('/api/permisos')
      const data = await res.json()
      setFilas(data)
    } catch {
      toast.error('Error al cargar los permisos')
    } finally {
      setLoading(false)
    }
  }

  function togglePermiso(rol: string, modulo: Modulo, accion: Accion) {
    setFilas(prev => prev.map(f => {
      if (f.rol !== rol) return f
      return {
        ...f,
        permisos: {
          ...f.permisos,
          [modulo]: {
            ...f.permisos[modulo],
            [accion]: !f.permisos[modulo]?.[accion],
          }
        }
      }
    }))
  }

  async function guardarRol(rol: string) {
    const fila = filas.find(f => f.rol === rol)
    if (!fila) return

    setGuardando(rol)
    try {
      const res = await fetch('/api/permisos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol, permisos: fila.permisos }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Permisos de ${ETIQUETAS_ROL[rol]?.label ?? rol} guardados`)
    } catch {
      toast.error('Error al guardar los permisos')
    } finally {
      setGuardando(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Permisos por rol</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configura qué puede hacer cada rol en cada módulo de la aplicación.
        </p>
      </div>

      <div className="space-y-4">
        {filas.map(({ rol, permisos }) => {
          const esSuperadmin = rol === 'superadmin'
          const etiqueta = ETIQUETAS_ROL[rol]

          return (
            <div key={rol} className="card overflow-hidden">
              {/* Cabecera del rol */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  {esSuperadmin
                    ? <ShieldCheck className="w-5 h-5 text-purple-500" />
                    : <ShieldAlert className="w-5 h-5 text-slate-400" />
                  }
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${etiqueta?.color}`}>
                    {etiqueta?.label ?? rol}
                  </span>
                  {esSuperadmin && (
                    <span className="text-xs text-slate-400">Acceso total — no modificable</span>
                  )}
                </div>
                {!esSuperadmin && (
                  <button
                    onClick={() => guardarRol(rol)}
                    disabled={guardando === rol}
                    className="flex items-center gap-2 px-4 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                  >
                    {guardando === rol
                      ? <Loader2 size={12} className="animate-spin" />
                      : <Save size={12} />
                    }
                    Guardar
                  </button>
                )}
              </div>

              {/* Matriz de permisos */}
              <div className="px-5 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 w-32">
                          Módulo
                        </th>
                        {ACCIONES.map(a => (
                          <th key={a.id} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">
                            {a.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MODULOS.map(modulo => (
                        <tr key={modulo.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 text-sm font-medium text-slate-700">
                            {modulo.label}
                          </td>
                          {ACCIONES.map(accion => {
                            const activo = esSuperadmin
                              ? true
                              : permisos?.[modulo.id]?.[accion.id] ?? false

                            return (
                              <td key={accion.id} className="py-3 text-center px-4">
                                <button
                                  type="button"
                                  disabled={esSuperadmin}
                                  onClick={() => togglePermiso(rol, modulo.id, accion.id)}
                                  className={`
                                    w-5 h-5 rounded flex items-center justify-center mx-auto border-2 transition-colors
                                    ${activo
                                      ? 'bg-brand-500 border-brand-500'
                                      : 'bg-white border-slate-300 hover:border-brand-400'
                                    }
                                    ${esSuperadmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                                  `}
                                >
                                  {activo && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}