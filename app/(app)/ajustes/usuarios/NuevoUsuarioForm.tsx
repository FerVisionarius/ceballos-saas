'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

const ROLES = [
  { value: 'comercial', label: 'Comercial' },
  { value: 'admin', label: 'Administrador' },
  { value: 'superadmin', label: 'Super admin' },
  { value: 'readonly', label: 'Solo lectura' },
]

export function NuevoUsuarioForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', rol: 'comercial' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Error al crear el usuario')
      } else {
        toast.success(`Invitación enviada a ${form.email}`)
        setForm({ nombre: '', apellidos: '', email: '', rol: 'comercial' })
        router.refresh()
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
          <UserPlus className="w-4 h-4 text-brand-600" />
        </div>
        <h2 className="font-semibold text-slate-800">Invitar usuario</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label-field">Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange}
            className="input-field" placeholder="Fernando" required />
        </div>
        <div>
          <label className="label-field">Apellidos</label>
          <input name="apellidos" value={form.apellidos} onChange={handleChange}
            className="input-field" placeholder="García López" required />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            className="input-field" placeholder="usuario@ceballos.com" required />
        </div>
        <div>
          <label className="label-field">Rol</label>
          <select name="rol" value={form.rol} onChange={handleChange} className="input-field">
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-400">El usuario recibirá un email para crear su contraseña.</p>
        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar invitación'}
        </button>
      </form>
    </div>
  )
}