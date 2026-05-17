import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Shield } from 'lucide-react'

async function checkSuperadmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: perfil } = await admin.from('usuarios').select('rol').eq('id', user.id).single()
  if (perfil?.rol !== 'superadmin') redirect('/dashboard')
}

export default async function AjustesPage() {
  await checkSuperadmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ajustes</h1>
        <p className="text-sm text-slate-500 mt-1">Administración del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/ajustes/usuarios" className="card p-5 hover:shadow-md transition-shadow group">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
            <Users className="w-5 h-5 text-brand-600" />
          </div>
          <h2 className="font-semibold text-slate-800 mb-1">Usuarios</h2>
          <p className="text-sm text-slate-500">Invitar, gestionar y eliminar usuarios del sistema.</p>
        </Link>

        <Link href="/ajustes/permisos" className="card p-5 hover:shadow-md transition-shadow group">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="font-semibold text-slate-800 mb-1">Permisos por rol</h2>
          <p className="text-sm text-slate-500">Configura qué puede hacer cada rol en cada módulo.</p>
        </Link>
      </div>
    </div>
  )
}