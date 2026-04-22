// ============================================================
// TIPOS GLOBALES - Inmobiliaria Ceballos SaaS
// ============================================================

export type UserRole = 'superadmin' | 'admin' | 'comercial' | 'readonly'

export interface Usuario {
  id: string
  email: string
  nombre: string
  apellidos: string
  rol: UserRole
  activo: boolean
  created_at: string
}

export interface Cliente {
  id: string
  nombre: string
  apellidos: string
  nif_nie: string
  telefono: string
  email?: string
  direccion?: string
  ciudad?: string
  codigo_postal?: string
  nacionalidad?: string
  estado_civil?: string
  representante_nombre?: string
  representante_nif?: string
  created_at: string
  created_by: string
}

export interface Inmueble {
  id: string
  referencia: string
  direccion: string
  ciudad: string
  codigo_postal: string
  tipo: 'piso' | 'casa' | 'local' | 'garaje' | 'solar' | 'otro'
  metros_cuadrados?: number
  precio_venta?: number
  precio_alquiler?: number
  descripcion?: string
}

export interface DocumentoGenerado {
  id: string
  tipo: TipoDocumento
  subtipo: SubtipoDocumento
  cliente_id: string
  cliente?: Cliente
  datos: Record<string, unknown>
  url_pdf?: string
  url_docx?: string
  created_at: string
  created_by: string
  usuario?: Usuario
}

// ============================================================
// TIPOS DE DOCUMENTOS
// ============================================================

export type TipoDocumento =
  | 'nota_encargo'
  | 'documento_conformidad'
  | 'documento_senal'
  | 'contrato_arras'
  | 'reconocimiento_honorarios'
  | 'contrato_arrendamiento'

export type SubtipoDocumento =
  | 'nota_encargo_exclusiva'
  | 'nota_encargo_sin_exclusiva'
  | 'conformidad_arras_confirmatorias'
  | 'conformidad_arras_penitenciales'
  | 'senal_arrendamiento'
  | 'senal_compraventa_confirmatoria'
  | 'senal_compraventa_confirmatoria_banco'
  | 'senal_compraventa_penitencial_banco'
  | 'senal_compraventa_penitencial'
  | 'senal_oferta'
  | 'contrato_arras_penitencial'
  | 'contrato_arras_confirmatoria'
  | 'reconocimiento_honorarios'
  | 'contrato_arrendamiento'
  | 'contrato_arrendamiento_rescision'

// ============================================================
// SCHEMA DE CAMPOS
// ============================================================

export type TipoCampo =
  | 'text'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'cliente_selector'
  | 'inmueble_selector'
  | 'currency'
  | 'percentage'
  | 'phone'
  | 'email'
  | 'nif'

export interface OpcionSelect {
  value: string
  label: string
}

export interface CampoFormulario {
  id: string
  label: string
  tipo: TipoCampo
  obligatorio: boolean
  placeholder?: string
  opciones?: OpcionSelect[]        // para tipo 'select'
  ayuda?: string                   // texto de ayuda bajo el campo
  prefijo?: string                 // ej: "€" para currency
  sufijo?: string                  // ej: "%" para percentage
  ancho?: 'full' | 'half' | 'third' // layout
}

export interface SeccionFormulario {
  id: string
  titulo: string
  descripcion?: string
  campos: CampoFormulario[]
}

export interface DefinicionDocumento {
  tipo: TipoDocumento
  subtipo: SubtipoDocumento
  titulo: string
  descripcion: string
  secciones: SeccionFormulario[]
  icono?: string
}

export interface GrupoTipoDocumento {
  tipo: TipoDocumento
  label: string
  descripcion: string
  icono: string
  subtipos: {
    subtipo: SubtipoDocumento
    label: string
  }[]
}
