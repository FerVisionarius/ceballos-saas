'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, LayoutDashboard, Users, FileText, LogOut, ChevronRight, Settings, UserCog, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface SidebarProps {
  user: { nombre: string; apellidos: string; email: string; rol: UserRole }
}

const NAV_ITEMS = [
  { href: '/dashboard',          label: 'Dashboard',  icon: LayoutDashboard, roles: ['superadmin','admin','comercial','readonly'] },
  { href: '/inmuebles',          label: 'Inmuebles',  icon: Home,            roles: ['superadmin','admin','comercial','readonly'] },
  { href: '/clientes',           label: 'Clientes',   icon: Users,           roles: ['superadmin','admin','comercial'] },
  { href: '/documentos',         label: 'Documentos', icon: FileText,        roles: ['superadmin','admin','comercial'] },
  { href: '/ajustes/usuarios',   label: 'Usuarios',   icon: UserCog,         roles: ['superadmin'] },
  { href: '/ajustes',            label: 'Ajustes',    icon: Settings,        roles: ['superadmin','admin'] },
]

const ROL_LABELS: Record<UserRole, string> = {
  superadmin: 'Super admin', admin: 'Administrador', comercial: 'Comercial', readonly: 'Solo lectura',
}
const ROL_COLORS: Record<UserRole, string> = {
  superadmin: 'bg-purple-100 text-purple-700', admin: 'bg-brand-100 text-brand-700',
  comercial: 'bg-emerald-100 text-emerald-700', readonly: 'bg-slate-100 text-slate-600',
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user.rol))

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-slate-200 h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">Ceballos</p>
          <p className="text-xs text-slate-400">Inmobiliaria</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group',
                active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
              <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600')} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-brand-400" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-brand-700">{user.nombre?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 truncate">{user.nombre} {user.apellidos}</p>
            <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', ROL_COLORS[user.rol])}>
              {ROL_LABELS[user.rol]}
            </span>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
