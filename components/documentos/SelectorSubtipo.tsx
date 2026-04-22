'use client'
import { ChevronRight, FileText } from 'lucide-react'
import { GRUPOS_DOCUMENTOS, SCHEMA_DOCUMENTOS } from '@/lib/documentos/schema'
import type { TipoDocumento, SubtipoDocumento } from '@/types'

interface SelectorSubtipoProps {
  tipo: TipoDocumento
  onSelect: (subtipo: SubtipoDocumento) => void
}

export function SelectorSubtipo({ tipo, onSelect }: SelectorSubtipoProps) {
  const grupo = GRUPOS_DOCUMENTOS.find(g => g.tipo === tipo)
  if (!grupo) return null

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        Selecciona el subtipo de <strong className="text-slate-700">{grupo.label}</strong>
      </p>
      <div className="card overflow-hidden divide-y divide-slate-100">
        {grupo.subtipos.map(sub => {
          const def = SCHEMA_DOCUMENTOS.find(d => d.subtipo === sub.subtipo)
          const camposTotal = def?.secciones.reduce((acc, s) => acc + s.campos.length, 0) ?? 0
          const camposObligatorios = def?.secciones.reduce(
            (acc, s) => acc + s.campos.filter(c => c.obligatorio).length, 0
          ) ?? 0

          return (
            <button
              key={sub.subtipo}
              onClick={() => onSelect(sub.subtipo as SubtipoDocumento)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
            >
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-50 transition-colors">
                <FileText className="w-4 h-4 text-slate-500 group-hover:text-brand-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">
                  {sub.label}
                </p>
                {def?.descripcion && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{def.descripcion}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400">{camposTotal} campos</span>
                  <span className="text-xs text-rose-500">{camposObligatorios} obligatorios</span>
                  <span className="text-xs text-slate-400">{def?.secciones.length} secciones</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 shrink-0 transition-colors" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
