'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://gestion-ceballos.serversvisionarius.com/actualizar-password',
    })
    setEnviado(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Inmobiliaria Ceballos</h1>
        </div>
        <div className="card p-8">
          {enviado ? (
            <div className="text-center">
              <p className="text-slate-700 font-medium mb-2">Email enviado</p>
              <p className="text-sm text-slate-500">Revisa tu bandeja de entrada y sigue el enlace para crear tu nueva contraseña.</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Restablecer contraseña</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-field">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-field" placeholder="tu@email.com" required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar enlace'}
                </button>
              </form>
            </>
          )}
        </div>
        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-brand-600 hover:underline">Volver al login</a>
        </div>
      </div>
    </div>
  )
}