'use client'

import { useState, useEffect } from 'react'
import { X, Search, UserPlus, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

interface Cliente {
  id: string
  tratamiento: string | null
  nombre: string
  apellidos: string
  nif_nie: string
  telefono: string
  email: string
  direccion: string
  municipio: string
}

interface SelectorClienteModalProps {
  onSelect: (cliente: Cliente) => void
  onClose: () => void
}

const nuevoClienteSchema = z.object({
  tratamiento: z.enum(['Don', 'Doña'], { required_error: 'Requerido' }),
  nombre: z.string().min(1, 'Requerido'),
  apellidos: z.string().min(1, 'Requerido'),
  nif_nie: z.string().min(1, 'Requerido'),
  telefono: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional().or(z.literal('')),
  municipio: z.string().optional().or(z.literal('')),
})

type NuevoClienteForm = z.infer<typeof nuevoClienteSchema>

export function SelectorClienteModal({ onSelect, onClose }: SelectorClienteModalProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [creando, setCreando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NuevoClienteForm>({
    resolver: zodResolver(nuevoClienteSchema),
  })

  useEffect(() => {
    buscarClientes('')
  }, [])

  async function buscarClientes(q: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/clientes?search=${encodeURIComponent(q)}`)
      const data = await res.json()
      setClientes(data || [])
    } catch {
      toast.error('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    buscarClientes(e.target.value)
  }

  function handleClose() {
    setCreando(false)
    setSearch('')
    reset()
    onClose()
  }

  async function onCrearCliente(formData: NuevoClienteForm) {
    setGuardando(true)
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      const cliente: Cliente = await res.json()
      toast.success('Cliente creado correctamente')
      onSelect(cliente)
      handleClose()
    } catch {
      toast.error('Error al crear el cliente')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-slate-800">
            {creando ? 'Nuevo cliente' : 'Seleccionar cliente'}
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {!creando ? (
            <>
              {/* Búsqueda */}
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Lista */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-brand-500" size={24} />
                </div>
              ) : clientes.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-6">No se encontraron clientes</p>
              ) : (
                <ul className="space-y-2">
                  {clientes.map(c => (
                    <li key={c.id}>
                      <button
                        onClick={() => { onSelect(c); handleClose() }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-200 transition-colors"
                      >
                        <p className="font-medium text-sm text-slate-800">
                          {c.tratamiento && (
                            <span className="text-slate-400 mr-1">{c.tratamiento}</span>
                          )}
                          {c.nombre} {c.apellidos}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{c.nif_nie} · {c.telefono}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Botón crear */}
              <button
                onClick={() => setCreando(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-brand-300 rounded-lg text-brand-600 text-sm hover:bg-brand-50 transition-colors"
              >
                <UserPlus size={16} />
                Crear nuevo cliente
              </button>
            </>
          ) : (
            /* Formulario crear */
            <form onSubmit={handleSubmit(onCrearCliente)} className="space-y-4">
              {/* Tratamiento + Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    {...register('tratamiento')}
                    className="w-20 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="" disabled>—</option>
                    <option value="Don">Don</option>
                    <option value="Doña">Doña</option>
                  </select>
                  <input
                    {...register('nombre')}
                    placeholder="Nombre"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {errors.tratamiento && <p className="text-red-500 text-xs mt-1">{errors.tratamiento.message}</p>}
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('apellidos')}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos.message}</p>}
              </div>

              {/* DNI/NIE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  DNI / NIE <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('nif_nie')}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {errors.nif_nie && <p className="text-red-500 text-xs mt-1">{errors.nif_nie.message}</p>}
              </div>

              {/* Municipio + Dirección */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Municipio</label>
                  <input
                    {...register('municipio')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calle y número</label>
                  <input
                    {...register('direccion')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Teléfono + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('telefono')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setCreando(false); reset() }}
                  className="flex-1 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {guardando && <Loader2 size={14} className="animate-spin" />}
                  Guardar cliente
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}