'use client'
import { useState, useEffect } from 'react'
import { Search, X, Plus, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface Cliente {
  id: string
  nombre: string
  apellidos: string
  nif_nie?: string
  telefono?: string
  email?: string
  direccion?: string
}

interface Props {
  onSelect: (cliente: Cliente) => void
  onClose: () => void
}

export function SelectorClienteModal({ onSelect, onClose }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [vista, setVista] = useState<'lista' | 'nuevo'>('lista')
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellidos: '', nif_nie: '', telefono: '', email: '', direccion: ''
  })

  useEffect(() => {
    fetch('/api/clientes')
      .then(r => r.json())
      .then(data => { setClientes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtrados = clientes.filter(c =>
    `${c.nombre} ${c.apellidos} ${c.nif_nie ?? ''}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleCrearCliente(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre || !form.apellidos) {
      toast.error('Nombre y apellidos son obligatorios')
      return
    }
    setGuardando(true)
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al crear el cliente')
      } else {
        toast.success(`Cliente ${form.nombre} ${form.apellidos} creado`)
        onSelect(data)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setGuardando(false)
    }
  }

  const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {vista === 'nuevo' && (
              <button onClick={() => setVista('lista')} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="font-semibold text-slate-800">
              {vista === 'lista' ? 'Seleccionar cliente' : 'Nuevo cliente'}
            </h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista */}
        {vista === 'lista' && (
          <div className="p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input autoFocus type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o NIF..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {loading && <p className="text-sm text-slate-500 text-center py-6">Cargando...</p>}
              {!loading && filtrados.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">No se encontraron clientes</p>
              )}
              {filtrados.map(c => (
                <button key={c.id} onClick={() => onSelect(c)}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-brand-700">{c.nombre.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{c.nombre} {c.apellidos}</p>
                    <p className="text-xs text-slate-500">{c.nif_nie ?? ''}{c.telefono ? ` · ${c.telefono}` : ''}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Botón crear nuevo */}
            <div className="pt-3 border-t border-slate-100 mt-3">
              <button onClick={() => setVista('nuevo')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Crear nuevo cliente
              </button>
            </div>
          </div>
        )}

        {/* Formulario nuevo cliente */}
        {vista === 'nuevo' && (
          <form onSubmit={handleCrearCliente} className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre <span className="text-red-500">*</span></label>
                <input name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} placeholder="Fernando" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Apellidos <span className="text-red-500">*</span></label>
                <input name="apellidos" value={form.apellidos} onChange={handleChange} className={inputClass} placeholder="García López" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">NIF / NIE</label>
                <input name="nif_nie" value={form.nif_nie} onChange={handleChange} className={inputClass} placeholder="12345678A" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} placeholder="600 000 000" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Dirección</label>
              <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Calle Mayor 1" />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setVista('lista')} className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={guardando} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50">
                {guardando ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...</> : 'Crear y seleccionar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}