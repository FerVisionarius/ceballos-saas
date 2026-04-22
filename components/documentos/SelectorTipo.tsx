'use client'
import {
  FileSignature, Handshake, CreditCard, ScrollText, Receipt, Building2
} from 'lucide-react'
import { GRUPOS_DOCUMENTOS } from '@/lib/documentos/schema'
import type { TipoDocumento } from '@/types'

const ICONOS: Record<string, React.ElementType> = {
  FileSignature, HandshakeIcon: Handshake, CreditCard, ScrollText, Receipt, Building2
}

const COLORES: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  nota_encargo:            { bg: 'bg-violet-50',  text: 'text-violet-600', border: 'border-violet-200', hover: 'hover:border-violet-400 hover:bg-violet-50' },
  documento_conformidad:   { bg: 'bg-blue-50',    text: 'text-blue-600',   border: 'border-blue-200',   hover: 'hover:border-blue-400 hover:bg-blue-50' },
  documento_senal:         { bg: 'bg-amber-50',   text: 'text-amber-600',  border: 'border-amber-200',  hover: 'hover:border-amber-400 hover:bg-amber-50' },
  contrato_arras:          { bg: 'bg-emerald-50', text: 'text-emerald-600',border: 'border-emerald-200',hover: 'hover:border-emerald-400 hover:bg-emerald-50' },
  reconocimiento_honorarios: { bg: 'bg-rose-50',  text: 'text-rose-600',   border: 'border-rose-200',   hover: 'hover:border-rose-400 hover:bg-rose-50' },
  contrato_arrendamiento:  { bg: 'bg-cyan-50',    text: 'text-cyan-600',   border: 'border-cyan-200',   hover: 'hover:border-cyan-400 hover:bg-cyan-50' },
}

interface SelectorTipoProps {
  onSelect: (tipo: TipoDocumento) => void
}

export function SelectorTipo({ onSelect }: SelectorTipoProps) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">Selecciona la categoría del documento que necesitas generar</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GRUPOS_DOCUMENTOS.map(grupo => {
          const Icon = ICONOS[grupo.icono] ?? FileSignature
          const color = COLORES[grupo.tipo] ?? COLORES.nota_encargo
          return (
            <button
              key={grupo.tipo}
              onClick={() => onSelect(grupo.tipo as TipoDocumento)}
              className={`group card p-5 text-left border-2 transition-all duration-150 ${color.border} ${color.hover} hover:shadow-md active:scale-[0.98]`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color.bg}`}>
                <Icon className={`w-5 h-5 ${color.text}`} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1 text-sm">{grupo.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{grupo.descripcion}</p>
              <div className="mt-3 flex items-center gap-1">
                <span className={`text-xs font-medium ${color.text}`}>
                  {grupo.subtipos.length} {grupo.subtipos.length === 1 ? 'documento' : 'documentos'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
