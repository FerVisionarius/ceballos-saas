import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/server'
import { FiltroDocumentos } from './FiltroDocumentos'

async function getDocumentos() {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('documentos')
      .select('*, usuarios(nombre, apellidos)')
      .order('created_at', { ascending: false })
      .limit(100)
    return data ?? []
  } catch {
    return []
  }
}

export default async function DocumentosPage() {
  const documentos = await getDocumentos()
  const subtiposUnicos: string[] = Array.from(new Set(documentos.map((d: any) => d.subtipo as string)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documentos</h1>
          <p className="text-slate-500 mt-1">{documentos.length} documentos generados</p>
        </div>
        <Link href="/documentos/nuevo" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nuevo documento
        </Link>
      </div>

      {documentos.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Sin documentos todavía</h3>
          <p className="text-sm text-slate-500 mb-6">Genera tu primer documento.</p>
          <Link href="/documentos/nuevo" className="btn-primary">
            <Plus className="w-4 h-4" />
            Crear primer documento
          </Link>
        </div>
      ) : (
        <FiltroDocumentos
          documentos={documentos}
          subtiposUnicos={subtiposUnicos}
        />
      )}
    </div>
  )
}