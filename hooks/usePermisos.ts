'use client'

import { useEffect, useState } from 'react'

export type Modulo = 'clientes' | 'inmuebles' | 'documentos' | 'usuarios'
export type Accion = 'ver' | 'crear' | 'editar' | 'eliminar'
export type PermisosModulo = Record<Accion, boolean>
export type PermisosRol = Record<Modulo, PermisosModulo>

const DENEGADO: PermisosModulo = { ver: false, crear: false, editar: false, eliminar: false }

export function usePermisos() {
  const [permisos, setPermisos] = useState<PermisosRol | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/permisos/me')
      .then(r => r.json())
      .then(data => setPermisos(data))
      .catch(() => setPermisos(null))
      .finally(() => setLoading(false))
  }, [])

  function puede(modulo: Modulo, accion: Accion): boolean {
    if (!permisos) return false
    return permisos?.[modulo]?.[accion] ?? false
  }

  function permisosModulo(modulo: Modulo): PermisosModulo {
    return permisos?.[modulo] ?? DENEGADO
  }

  return { permisos, loading, puede, permisosModulo }
}