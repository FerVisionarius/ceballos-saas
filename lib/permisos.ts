import { createAdminClient } from '@/lib/supabase/server'

export type Modulo = 'clientes' | 'inmuebles' | 'documentos' | 'usuarios'
export type Accion = 'ver' | 'crear' | 'editar' | 'eliminar'

export type PermisosModulo = Record<Accion, boolean>
export type PermisosRol = Record<Modulo, PermisosModulo>

// Permisos por defecto (fallback seguro — todo denegado)
const PERMISOS_DENEGADOS: PermisosModulo = {
  ver: false, crear: false, editar: false, eliminar: false,
}

// Superadmin siempre tiene todo — nunca se toca su fila
const PERMISOS_SUPERADMIN: PermisosRol = {
  clientes:  { ver: true, crear: true, editar: true, eliminar: true },
  inmuebles: { ver: true, crear: true, editar: true, eliminar: true },
  documentos:{ ver: true, crear: true, editar: true, eliminar: true },
  usuarios:  { ver: true, crear: true, editar: true, eliminar: true },
}

let cache: Record<string, { permisos: PermisosRol; ts: number }> = {}
const CACHE_TTL = 30_000 // 30 segundos

export async function getPermisosRol(rol: string): Promise<PermisosRol> {
  if (rol === 'superadmin') return PERMISOS_SUPERADMIN

  const ahora = Date.now()
  if (cache[rol] && ahora - cache[rol].ts < CACHE_TTL) {
    return cache[rol].permisos
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('permisos_rol')
    .select('permisos')
    .eq('rol', rol)
    .single()

  if (error || !data) return { clientes: PERMISOS_DENEGADOS, inmuebles: PERMISOS_DENEGADOS, documentos: PERMISOS_DENEGADOS, usuarios: PERMISOS_DENEGADOS }

  const permisos = data.permisos as PermisosRol
  cache[rol] = { permisos, ts: ahora }
  return permisos
}

export async function checkPermiso(rol: string, modulo: Modulo, accion: Accion): Promise<boolean> {
  if (rol === 'superadmin') return true
  const permisos = await getPermisosRol(rol)
  return permisos?.[modulo]?.[accion] ?? false
}

export function invalidarCache(rol?: string) {
  if (rol) delete cache[rol]
  else cache = {}
}