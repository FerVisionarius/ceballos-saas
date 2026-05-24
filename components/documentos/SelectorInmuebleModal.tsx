'use client'
import { useState, useEffect } from 'react'
import { Search, X, Home, Plus, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface Inmueble {
  id: string
  direccion: string
  ciudad: string
  codigo_postal?: string
  tipo: string
  referencia?: string
  metros_cuadrados?: number
  precio_venta?: number
  precio_alquiler?: number
  referencia_catastral?: string
}

interface Props {
  onSelect: (inmueble: Inmueble) => void
  onClose: () => void
  // Datos actuales del formulario para pre-rellenar el modal de creación
  datosPrefill?: {
    municipioinmueble?: string
    calleinmueble?: string
    referenciacatastralinmueble?: string
  }
}

const TIPO_LABELS: Record<string, string> = {
  piso: 'Piso', casa: 'Casa', local: 'Local',
  garaje: 'Garaje', solar: 'Solar', otro: 'Otro',
}

const ESTADO_LABELS: Record<string, string> = {
  en_cartera: 'En cartera',
  reservado: 'Reservado',
  vendido: 'Vendido',
  alquilado: 'Alquilado',
}

export function SelectorInmuebleModal({ onSelect, onClose, datosPrefill }: Props) {
  const [vista, setVista] = useState<'buscar' | 'crear' | 'confirmar'>('buscar')
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const [form, setForm] = useState({
    referencia: '',
    tipo: 'piso',
    estado: 'en_cartera',
    direccion: datosPrefill?.calleinmueble ?? '',
    ciudad: datosPrefill?.municipioinmueble ?? '',
    codigo_postal: '',
    metros_cuadrados: '',
    habitaciones: '',
    banos: '',
    precio_venta: '',
    precio_alquiler: '',
    referencia_catastral: datosPrefill?.referenciacatastralinmueble ?? '',
    notas: '',
  })

  useEffect(() => {
    fetch('/api/inmuebles')
      .then(r => r.json())
      .then(data => { setInmuebles(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtrados = inmuebles.filter(i =>
    `${i.direccion} ${i.ciudad} ${i.referencia ?? ''}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleGuardar() {
    setGuardando(true)
    try {
      const res = await fetch('/api/inmuebles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al guardar el inmueble')
        return
      }
      toast.success('Inmueble guardado y cargado correctamente')
      onSelect(data)
      onClose()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setGuardando(false)
    }
  }

  const inputClass = "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
  const labelClass = "block text-sm font-medium text-slate-700 mb-1"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            {vista !== 'buscar' && (
              <button
                onClick={() => setVista('buscar')}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Volver
              </button>
            )}
            <h3 className="font-semibold text-slate-800">
              {vista === 'buscar' && 'Seleccionar inmueble'}
              {vista === 'crear' && 'Nuevo inmueble'}
              {vista === 'confirmar' && 'Confirmar datos'}
            </h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* Vista: buscar inmueble existente */}
          {vista === 'buscar' && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar por dirección o referencia..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="divide-y divide-slate-100">
                {loading && <p className="text-sm text-slate-500 text-center py-6">Cargando...</p>}
                {!loading && filtrados.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-6">No se encontraron inmuebles</p>
                )}
                {filtrados.map(i => (
                  <button
                    key={i.id}
                    onClick={() => { onSelect(i); onClose() }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <Home className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{i.direccion}</p>
                      <p className="text-xs text-slate-500">
                        {TIPO_LABELS[i.tipo]} · {i.ciudad}
                        {i.referencia ? ` · ${i.referencia}` : ''}
                        {i.precio_venta
                          ? ` · ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(i.precio_venta)}`
                          : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Vista: formulario crear */}
          {vista === 'crear' && (
            <div className="space-y-4">
              {/* Identificación */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Identificación</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Referencia interna</label>
                    <input name="referencia" value={form.referencia} onChange={handleChange} className={inputClass} placeholder="CEB-001" />
                  </div>
                  <div>
                    <label className={labelClass}>Tipo <span className="text-red-500">*</span></label>
                    <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                      <option value="piso">Piso / Apartamento</option>
                      <option value="casa">Casa / Chalet</option>
                      <option value="local">Local comercial</option>
                      <option value="garaje">Garaje / Plaza</option>
                      <option value="solar">Solar / Terreno</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Estado <span className="text-red-500">*</span></label>
                    <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
                      <option value="en_cartera">En cartera</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                      <option value="alquilado">Alquilado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ubicación</p>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Dirección completa <span className="text-red-500">*</span></label>
                    <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Calle Mayor 1, 2ºA" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Ciudad <span className="text-red-500">*</span></label>
                      <input name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} placeholder="Madrid" required />
                    </div>
                    <div>
                      <label className={labelClass}>Código postal</label>
                      <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} className={inputClass} placeholder="28001" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Referencia catastral</label>
                    <input name="referencia_catastral" value={form.referencia_catastral} onChange={handleChange} className={inputClass} placeholder="0000000AA0000A0000AA" />
                  </div>
                </div>
              </div>

              {/* Características */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Características</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>m²</label>
                    <input name="metros_cuadrados" type="number" min="0" value={form.metros_cuadrados} onChange={handleChange} className={inputClass} placeholder="80" />
                  </div>
                  <div>
                    <label className={labelClass}>Habitaciones</label>
                    <input name="habitaciones" type="number" min="0" value={form.habitaciones} onChange={handleChange} className={inputClass} placeholder="3" />
                  </div>
                  <div>
                    <label className={labelClass}>Baños</label>
                    <input name="banos" type="number" min="0" value={form.banos} onChange={handleChange} className={inputClass} placeholder="1" />
                  </div>
                </div>
              </div>

              {/* Precios */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Precios</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Precio venta (€)</label>
                    <input name="precio_venta" type="number" min="0" value={form.precio_venta} onChange={handleChange} className={inputClass} placeholder="250000" />
                  </div>
                  <div>
                    <label className={labelClass}>Precio alquiler/mes (€)</label>
                    <input name="precio_alquiler" type="number" min="0" value={form.precio_alquiler} onChange={handleChange} className={inputClass} placeholder="900" />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className={labelClass}>Notas internas</label>
                <textarea name="notas" value={form.notas} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} placeholder="Observaciones..." />
              </div>
            </div>
          )}

          {/* Vista: confirmar datos */}
          {vista === 'confirmar' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 mb-4">Revisa los datos antes de guardar el inmueble en la base de datos.</p>

              {[
                { label: 'Referencia', valor: form.referencia || '—' },
                { label: 'Tipo', valor: TIPO_LABELS[form.tipo] },
                { label: 'Estado', valor: ESTADO_LABELS[form.estado] },
                { label: 'Dirección', valor: form.direccion || '—' },
                { label: 'Ciudad', valor: form.ciudad || '—' },
                { label: 'Código postal', valor: form.codigo_postal || '—' },
                { label: 'Ref. catastral', valor: form.referencia_catastral || '—' },
                { label: 'Superficie', valor: form.metros_cuadrados ? `${form.metros_cuadrados} m²` : '—' },
                { label: 'Habitaciones', valor: form.habitaciones || '—' },
                { label: 'Baños', valor: form.banos || '—' },
                { label: 'Precio venta', valor: form.precio_venta ? `${Number(form.precio_venta).toLocaleString('es-ES')} €` : '—' },
                { label: 'Precio alquiler', valor: form.precio_alquiler ? `${Number(form.precio_alquiler).toLocaleString('es-ES')} €/mes` : '—' },
                { label: 'Notas', valor: form.notas || '—' },
              ].map(({ label, valor }) => (
                <div key={label} className="flex justify-between items-start py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-medium text-slate-500 w-36 shrink-0">{label}</span>
                  <span className="text-sm text-slate-800 text-right">{valor}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 shrink-0 flex justify-between items-center">
          {vista === 'buscar' && (
            <>
              <span className="text-xs text-slate-400">{filtrados.length} inmuebles</span>
              <button
                onClick={() => setVista('crear')}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo inmueble
              </button>
            </>
          )}
          {vista === 'crear' && (
            <>
              <button
                onClick={() => setVista('buscar')}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!form.direccion || !form.ciudad) {
                    toast.error('Dirección y ciudad son obligatorios')
                    return
                  }
                  setVista('confirmar')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                Revisar datos →
              </button>
            </>
          )}
          {vista === 'confirmar' && (
            <>
              <button
                onClick={() => setVista('crear')}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                ← Editar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Guardar inmueble
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}