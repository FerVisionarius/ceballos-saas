'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil, X, Check } from 'lucide-react'
import { toast } from 'sonner'

const TIPO_OPTIONS = [
  { value: 'piso', label: 'Piso / Apartamento' },
  { value: 'casa', label: 'Casa / Chalet' },
  { value: 'local', label: 'Local comercial' },
  { value: 'garaje', label: 'Garaje / Plaza' },
  { value: 'solar', label: 'Solar / Terreno' },
  { value: 'otro', label: 'Otro' },
]

const ESTADO_OPTIONS = [
  { value: 'en_cartera', label: 'En cartera' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'alquilado', label: 'Alquilado' },
]

export function EditarInmuebleForm({ inmueble }: { inmueble: any }) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    referencia: inmueble.referencia ?? '',
    tipo: inmueble.tipo ?? 'piso',
    estado: inmueble.estado ?? 'en_cartera',
    direccion: inmueble.direccion ?? '',
    ciudad: inmueble.ciudad ?? '',
    codigo_postal: inmueble.codigo_postal ?? '',
    metros_cuadrados: inmueble.metros_cuadrados ?? '',
    habitaciones: inmueble.habitaciones ?? '',
    banos: inmueble.banos ?? '',
    precio_venta: inmueble.precio_venta ?? '',
    precio_alquiler: inmueble.precio_alquiler ?? '',
    referencia_catastral: inmueble.referencia_catastral ?? '',
    notas: inmueble.notas ?? '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleGuardar() {
    setLoading(true)
    try {
      const res = await fetch(`/api/inmuebles/${inmueble.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al guardar')
      } else {
        toast.success('Inmueble actualizado')
        setEditando(false)
        router.refresh()
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"

  if (!editando) {
    return (
      <button onClick={() => setEditando(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
        <Pencil className="w-4 h-4" />
        Editar inmueble
      </button>
    )
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Editando inmueble</h2>
        <div className="flex gap-2">
          <button onClick={() => setEditando(false)} className="btn-secondary py-1.5 px-3 text-xs">
            <X className="w-3.5 h-3.5" /> Cancelar
          </button>
          <button onClick={handleGuardar} disabled={loading} className="btn-primary py-1.5 px-3 text-xs">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Guardar</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Referencia</label>
          <input name="referencia" value={form.referencia} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
            {TIPO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
            {ESTADO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="col-span-12">
          <label className="block text-xs font-medium text-slate-600 mb-1">Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-8">
          <label className="block text-xs font-medium text-slate-600 mb-1">Ciudad</label>
          <input name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Código postal</label>
          <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Metros cuadrados</label>
          <input name="metros_cuadrados" type="number" value={form.metros_cuadrados} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Habitaciones</label>
          <input name="habitaciones" type="number" value={form.habitaciones} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Baños</label>
          <input name="banos" type="number" value={form.banos} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <label className="block text-xs font-medium text-slate-600 mb-1">Precio venta (€)</label>
          <input name="precio_venta" type="number" value={form.precio_venta} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <label className="block text-xs font-medium text-slate-600 mb-1">Precio alquiler (€/mes)</label>
          <input name="precio_alquiler" type="number" value={form.precio_alquiler} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12">
          <label className="block text-xs font-medium text-slate-600 mb-1">Referencia catastral</label>
          <input name="referencia_catastral" value={form.referencia_catastral} onChange={handleChange} className={inputClass} />
        </div>
        <div className="col-span-12">
          <label className="block text-xs font-medium text-slate-600 mb-1">Notas internas</label>
          <textarea name="notas" value={form.notas} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
        </div>
      </div>
    </div>
  )
}