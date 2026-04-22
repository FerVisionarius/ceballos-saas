'use client'
import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { GRUPOS_DOCUMENTOS } from '@/lib/documentos/schema'
import { SelectorTipo } from './SelectorTipo'
import { SelectorSubtipo } from './SelectorSubtipo'
import { FormularioDinamico } from './FormularioDinamico'
import type { TipoDocumento, SubtipoDocumento } from '@/types'

type Step = 'tipo' | 'subtipo' | 'formulario'

const STEP_LABELS: Record<Step, string> = {
  tipo: 'Tipo de documento',
  subtipo: 'Subtipo',
  formulario: 'Datos del documento',
}

const STEPS: Step[] = ['tipo', 'subtipo', 'formulario']

export function DocumentoWizard() {
  const [step, setStep] = useState<Step>('tipo')
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoDocumento | null>(null)
  const [subtipoSeleccionado, setSubtipoSeleccionado] = useState<SubtipoDocumento | null>(null)

  const stepIndex = STEPS.indexOf(step)

  function handleSelectTipo(tipo: TipoDocumento) {
    setTipoSeleccionado(tipo)
    setSubtipoSeleccionado(null)
    // Si solo tiene un subtipo, saltar directo al formulario
    const grupo = GRUPOS_DOCUMENTOS.find(g => g.tipo === tipo)
    if (grupo?.subtipos.length === 1) {
      setSubtipoSeleccionado(grupo.subtipos[0].subtipo as SubtipoDocumento)
      setStep('formulario')
    } else {
      setStep('subtipo')
    }
  }

  function handleSelectSubtipo(subtipo: SubtipoDocumento) {
    setSubtipoSeleccionado(subtipo)
    setStep('formulario')
  }

  function handleBack() {
    if (step === 'formulario') {
      const grupo = GRUPOS_DOCUMENTOS.find(g => g.tipo === tipoSeleccionado)
      if (grupo?.subtipos.length === 1) {
        setStep('tipo')
      } else {
        setStep('subtipo')
      }
    } else if (step === 'subtipo') {
      setStep('tipo')
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="card px-6 py-4">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const current = s === step
            const done = STEPS.indexOf(step) > i
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  current ? 'text-brand-700' : done ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    current ? 'bg-brand-600 text-white' :
                    done ? 'bg-slate-800 text-white' :
                    'bg-slate-200 text-slate-500'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Breadcrumb info */}
        {tipoSeleccionado && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500">
            <span className="font-medium text-slate-700">
              {GRUPOS_DOCUMENTOS.find(g => g.tipo === tipoSeleccionado)?.label}
            </span>
            {subtipoSeleccionado && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-medium text-slate-700">
                  {GRUPOS_DOCUMENTOS
                    .find(g => g.tipo === tipoSeleccionado)
                    ?.subtipos.find(s => s.subtipo === subtipoSeleccionado)?.label}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Botón volver */}
      {step !== 'tipo' && (
        <button onClick={handleBack} className="btn-ghost -mt-2">
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      )}

      {/* Contenido del paso actual */}
      {step === 'tipo' && (
        <SelectorTipo onSelect={handleSelectTipo} />
      )}

      {step === 'subtipo' && tipoSeleccionado && (
        <SelectorSubtipo
          tipo={tipoSeleccionado}
          onSelect={handleSelectSubtipo}
        />
      )}

      {step === 'formulario' && tipoSeleccionado && subtipoSeleccionado && (
        <FormularioDinamico
          tipo={tipoSeleccionado}
          subtipo={subtipoSeleccionado}
        />
      )}
    </div>
  )
}
