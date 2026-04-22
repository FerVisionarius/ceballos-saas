'use client'
import { useState, useEffect } from 'react'
import { Search, X, Home } from 'lucide-react'

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
}

const TIPO_LABELS: Record<string, string> = {
  piso: 'Piso', casa: 'Casa', local: 'Local',
  garaje: 'Garaje', solar: 'Solar', otro: 'Otro',
}

export function SelectorInmuebleModal({ onSelect, onClose }: Props) {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/inmuebles')
      .then(r => r.json())
      .then(data => { setInmuebles(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtrados = inmuebles.filter(i =>
    `${i.direccion} ${i.ciudad} ${i.referencia ?? ''}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Seleccionar inmueble</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input autoFocus type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por dirección o referencia..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {loading && <p className="text-sm text-slate-500 text-center py-6">Cargando...</p>}
            {!loading && filtrados.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No se encontraron inmuebles</p>
            )}
            {filtrados.map(i => (
              <button key={i.id} onClick={() => onSelect(i)}
                className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{i.direccion}</p>
                  <p className="text-xs text-slate-500">
                    {TIPO_LABELS[i.tipo]} · {i.ciudad}
                    {i.referencia ? ` · ${i.referencia}` : ''}
                    {i.precio_venta ? ` · ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(i.precio_venta)}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}