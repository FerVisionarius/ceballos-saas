import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NuevoUsuarioForm } from './NuevoUsuarioForm'
import { UsuariosFila } from './UsuariosFila'

async function getUsuarios() {
  const admin = createAdminClient()
  const { data } = await admin.from('usuarios').select('*').order('created_at', { ascending: false })
  return data ?? []
}

async function checkSuperadmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const admin = createAdminClient()
  const { data: perfil } = await admin.from('usuarios').select('rol, id').eq('id', user.id).single()
  if (perfil?.rol !== 'superadmin') redirect('/dashboard')
  return perfil
}

export default async function UsuariosPage() {
  const perfil = await checkSuperadmin()
  const usuarios = await getUsuarios()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Gestión de usuarios</h1>
        <p className="text-slate-500 mt-1">{usuarios.length} usuarios registrados</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NuevoUsuarioForm />
        </div>
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Usuarios del sistema</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {usuarios.map((u: any) => (
                <UsuariosFila key={u.id} usuario={u} currentUserId={perfil.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}