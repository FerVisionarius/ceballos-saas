'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  clientes: { id: string; nombre: string; apellidos: string }[]
}

export function NuevoInmuebleForm({ clientes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    referencia: '', tipo: 'piso', estado: 'en_cartera',
    direccion: '', ciudad: '', codigo_postal: '',
    metros_cuadrados: '', habitaciones: '', banos: '',
    precio_venta: '', precio_alquiler: '',
    referencia_catastral: '', propietario_id: '', notas: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/inmuebles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al guardar el inmueble')
      } else {
        toast.success('Inmueble guardado correctamente')
        router.push('/inmuebles')
        router.refresh()
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
  const labelClass = "block text-sm font-medium text-slate-700 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
          Identificación
        </h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-4">
            <label className={labelClass}>Referencia interna</label>
            <input name="referencia" value={form.referencia} onChange={handleChange} className={inputClass} placeholder="Ej: CEB-001" />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <label className={labelClass}>Tipo <span className="text-red-500">*</span></label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass} required>
              <option value="piso">Piso / Apartamento</option>
              <option value="casa">Casa / Chalet</option>
              <option value="local">Local comercial</option>
              <option value="garaje">Garaje / Plaza</option>
              <option value="solar">Solar / Terreno</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <label className={labelClass}>Estado <span className="text-red-500">*</span></label>
            <select name="estado" value={form.estado} onChange={handleChange} className={inputClass} required>
              <option value="en_cartera">En cartera</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="alquilado">Alquilado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
          Ubicación
        </h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <label className={labelClass}>Dirección <span className="text-red-500">*</span></label>
            <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Calle Mayor 1, 2ºA" required />
          </div>
          <div className="col-span-12 sm:col-span-8">
            <label className={labelClass}>Ciudad <span className="text-red-500">*</span></label>
            <input name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} placeholder="Madrid" required />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <label className={labelClass}>Código postal</label>
            <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} className={inputClass} placeholder="28001" />
          </div>
          <div className="col-span-12">
            <label className={labelClass}>Referencia catastral</label>
            <input name="referencia_catastral" value={form.referencia_catastral} onChange={handleChange} className={inputClass} placeholder="0000000AA0000A0000AA" />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
          Características
        </h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-4">
            <label className={labelClass}>Metros cuadrados</label>
            <div className="relative">
              <input name="metros_cuadrados" type="number" min="0" step="0.01" value={form.metros_cuadrados} onChange={handleChange} className={`${inputClass} pr-10`} placeholder="80" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">m²</span>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <label className={labelClass}>Habitaciones</label>
            <input name="habitaciones" type="number" min="0" value={form.habitaciones} onChange={handleChange} className={inputClass} placeholder="3" />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <label className={labelClass}>Baños</label>
            <input name="banos" type="number" min="0" value={form.banos} onChange={handleChange} className={inputClass} placeholder="1" />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
          Precios
        </h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <label className={labelClass}>Precio de venta</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
              <input name="precio_venta" type="number" min="0" step="0.01" value={form.precio_venta} onChange={handleChange} className={`${inputClass} pl-7`} placeholder="250000" />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6">
            <label className={labelClass}>Precio alquiler / mes</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
              <input name="precio_alquiler" type="number" min="0" step="0.01" value={form.precio_alquiler} onChange={handleChange} className={`${inputClass} pl-7`} placeholder="900" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
          Propietario y notas
        </h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <label className={labelClass}>Propietario</label>
            <select name="propietario_id" value={form.propietario_id} onChange={handleChange} className={inputClass}>
              <option value="">— Sin propietario asignado —</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellidos}</option>
              ))}
            </select>
          </div>
          <div className="col-span-12">
            <label className={labelClass}>Notas internas</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} rows={3}
              className={`${inputClass} resize-none`} placeholder="Observaciones, estado de la negociación..." />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary px-8">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : 'Guardar inmueble'}
        </button>
      </div>
    </form>
  )
}