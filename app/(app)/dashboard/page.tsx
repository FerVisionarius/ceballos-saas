import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { FileText, Users, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  try {
    const admin = createAdminClient()
    const [{ count: totalClientes }, { count: totalDocumentos }, { data: recientes }] = await Promise.all([
      admin.from('clientes').select('*', { count: 'exact', head: true }),
      admin.from('documentos').select('*', { count: 'exact', head: true }),
      admin.from('documentos').select('id, subtipo, created_at, clientes(nombre, apellidos)').order('created_at', { ascending: false }).limit(5),
    ])
    return { totalClientes: totalClientes ?? 0, totalDocumentos: totalDocumentos ?? 0, recientes: recientes ?? [] }
  } catch {
    return { totalClientes: 0, totalDocumentos: 0, recientes: [] }
  }
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const admin = createAdminClient()
  const { data: perfil } = await admin.from('usuarios').select('nombre').eq('id', user!.id).single()

  const { totalClientes, totalDocumentos, recientes } = await getStats()
  const nombre = perfil?.nombre ?? 'Usuario'
  const hora = new Date().getHours()
  const saludo = hora < 13 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{saludo}, {nombre}</h1>
        <p className="text-slate-500 mt-1">Resumen de actividad</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Clientes registrados" value={totalClientes} color="blue" />
        <StatCard icon={FileText} label="Documentos generados" value={totalDocumentos} color="indigo" />
        <StatCard icon={TrendingUp} label="Este mes" value="—" color="emerald" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-3">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAction href="/documentos/nuevo" icon={FileText} title="Nuevo documento" desc="Genera un documento para un cliente" color="brand" />
          <QuickAction href="/clientes/nuevo" icon={Users} title="Nuevo cliente" desc="Registra un nuevo cliente" color="emerald" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600', indigo: 'bg-brand-50 text-brand-600', emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function QuickAction({ href, icon: Icon, title, desc, color }: { href: string; icon: any; title: string; desc: string; color: string }) {
  const colors: Record<string, string> = {
    brand: 'bg-brand-600 hover:bg-brand-700', emerald: 'bg-emerald-600 hover:bg-emerald-700',
  }
  return (
    <Link href={href} className={`flex items-center gap-4 px-5 py-4 rounded-xl text-white transition-colors ${colors[color]}`}>
      <Icon className="w-6 h-6 shrink-0 opacity-90" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm opacity-75">{desc}</p>
      </div>
    </Link>
  )
}