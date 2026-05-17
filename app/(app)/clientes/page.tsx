'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Loader2, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Link from 'next/link'

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

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
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
    cargarClientes()
  }, [])

  async function cargarClientes(q = '') {
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
    cargarClientes(e.target.value)
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
      toast.success('Cliente creado correctamente')
      setModalAbierto(false)
      reset()
      cargarClientes(search)
    } catch {
      toast.error('Error al crear el cliente')
    } finally {
      setGuardando(false)
    }
  }

  function handleCerrarModal() {
    setModalAbierto(false)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">
            {clientes.length} {clientes.length === 1 ? 'cliente registrado' : 'clientes registrados'}
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={handleSearch}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-brand-500" size={28} />
          </div>
        ) : clientes.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            {search ? 'No se encontraron clientes con ese criterio' : 'Aún no hay clientes registrados'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Nombre</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">NIF/NIE</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Teléfono</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Ciudad</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-brand-700">
                          {c.nombre?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {c.tratamiento && <span className="text-slate-400 mr-1">{c.tratamiento}</span>}
                        {c.nombre} {c.apellidos}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{c.nif_nie || '—'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{c.telefono || '—'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{c.email || '—'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{c.municipio || '—'}</td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/clientes/${c.id}`}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal nuevo cliente */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-slate-800">Nuevo cliente</h2>
              <button onClick={handleCerrarModal} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
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
                    onClick={handleCerrarModal}
                    className="flex-1 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}