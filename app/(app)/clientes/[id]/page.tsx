'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Mail, MapPin, CreditCard, User, Pencil, Loader2, X, Check } from 'lucide-react'
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
  email: string | null
  direccion: string | null
  municipio: string | null
  created_at: string
}

const editarClienteSchema = z.object({
  tratamiento: z.enum(['Don', 'Doña'], { required_error: 'Requerido' }),
  nombre: z.string().min(1, 'Requerido'),
  apellidos: z.string().min(1, 'Requerido'),
  nif_nie: z.string().min(1, 'Requerido'),
  telefono: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional().or(z.literal('')),
  municipio: z.string().optional().or(z.literal('')),
})

type EditarClienteForm = z.infer<typeof editarClienteSchema>

export default function ClienteDetallePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditarClienteForm>({
    resolver: zodResolver(editarClienteSchema),
  })

  useEffect(() => {
    cargarCliente()
  }, [])

  async function cargarCliente() {
    try {
      const res = await fetch(`/api/clientes/${params.id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCliente(data)
    } catch {
      toast.error('Error al cargar el cliente')
      router.push('/clientes')
    } finally {
      setLoading(false)
    }
  }

  function abrirEdicion() {
    if (!cliente) return
    reset({
      tratamiento: (cliente.tratamiento as 'Don' | 'Doña') ?? undefined,
      nombre: cliente.nombre ?? '',
      apellidos: cliente.apellidos ?? '',
      nif_nie: cliente.nif_nie ?? '',
      telefono: cliente.telefono ?? '',
      email: cliente.email ?? '',
      direccion: cliente.direccion ?? '',
      municipio: cliente.municipio ?? '',
    })
    setEditando(true)
  }

  async function onGuardar(formData: EditarClienteForm) {
    setGuardando(true)
    try {
      const res = await fetch(`/api/clientes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      const actualizado = await res.json()
      setCliente(actualizado)
      setEditando(false)
      toast.success('Cliente actualizado correctamente')
    } catch {
      toast.error('Error al guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    )
  }

  if (!cliente) return null

  const nombreCompleto = [cliente.tratamiento, cliente.nombre, cliente.apellidos].filter(Boolean).join(' ')

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div>
        <Link href="/clientes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a clientes
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <span className="text-xl font-semibold text-brand-700">
                {cliente.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{nombreCompleto}</h1>
              <p className="text-slate-400 text-xs mt-1">ID: {cliente.id}</p>
            </div>
          </div>
          {!editando && (
            <button
              onClick={abrirEdicion}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>

      {editando ? (
        /* Formulario de edición */
        <form onSubmit={handleSubmit(onGuardar)} className="space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-slate-800">Editar datos del cliente</h2>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

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
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
            >
              {guardando ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Guardar cambios
            </button>
          </div>
        </form>
      ) : (
        /* Vista de detalle */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-slate-800">Datos personales</h2>
            <div className="space-y-3">
              {cliente.tratamiento && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Tratamiento</p>
                    <p className="text-sm font-medium text-slate-800">{cliente.tratamiento}</p>
                  </div>
                </div>
              )}
              {cliente.nif_nie && (
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">NIF / NIE</p>
                    <p className="text-sm font-medium text-slate-800">{cliente.nif_nie}</p>
                  </div>
                </div>
              )}
              {cliente.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Teléfono</p>
                    <p className="text-sm font-medium text-slate-800">{cliente.telefono}</p>
                  </div>
                </div>
              )}
              {cliente.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-800">{cliente.email}</p>
                  </div>
                </div>
              )}
              {(cliente.municipio || cliente.direccion) && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Dirección</p>
                    <p className="text-sm font-medium text-slate-800">
                      {[cliente.direccion, cliente.municipio].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-2">Información adicional</h2>
            <p className="text-xs text-slate-400">
              Cliente registrado el{' '}
              {new Date(cliente.created_at).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}