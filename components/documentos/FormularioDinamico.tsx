'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, UserSearch, Home } from 'lucide-react'
import { toast } from 'sonner'
import { getDefinicionDocumento } from '@/lib/documentos/schema'
import { CampoInput } from './CampoInput'
import { SelectorClienteModal } from './SelectorClienteModal'
import { SelectorInmuebleModal } from './SelectorInmuebleModal'
import type { TipoDocumento, SubtipoDocumento, SeccionFormulario } from '@/types'

interface FormularioDinamicoProps {
  tipo: TipoDocumento
  subtipo: SubtipoDocumento
}

interface Cliente {
  id: string
  tratamiento: string | null
  nombre: string
  apellidos: string
  nif_nie: string
  telefono: string
  email: string
  direccion: string
  municipio: string
}

const SECCIONES_CLIENTE = [
  'vendedor', 'comprador', 'arrendador', 'arrendatario', 'cliente',
  'avalista', 'trabajador', 'propietario',
]
const SECCIONES_INMUEBLE = ['inmueble']

const CAMPOS_NOMBRE = [
  'nombrecliente', 'nombrecomprador', 'nombrevendedor',
  'nombrearrendador', 'nombrearrendatario',
  'nombrepropietario', 'nombreinquilino', 'nombreavalista', 'nombretrabajador',
]

const SUBTIPOS_SENAL = [
  'senal_arrendamiento',
  'senal_compraventa_confirmatoria',
  'senal_compraventa_confirmatoria_banco',
  'senal_compraventa_penitencial',
  'senal_compraventa_penitencial_banco',
]

export function FormularioDinamico({ tipo, subtipo }: FormularioDinamicoProps) {
  const def = getDefinicionDocumento(subtipo)
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  const [seccionesAbiertas, setSeccionesAbiertas] = useState<Record<string, boolean>>(() => {
    const inicial: Record<string, boolean> = {}
    def?.secciones.forEach(s => { inicial[s.id] = true })
    return inicial
  })
  const [modalCliente, setModalCliente] = useState<string | null>(null)
  const [modalInmueble, setModalInmueble] = useState<string | null>(null)
  const [nPersonas, setNPersonas] = useState<Record<string, number>>({})
  const [tratamientos, setTratamientos] = useState<Record<string, string>>({})
  const [compartenDomicilio, setCompartenDomicilio] = useState<Record<string, boolean>>({})

  const schemaFields: Record<string, z.ZodTypeAny> = {}
  def?.secciones.forEach(seccion => {
    seccion.campos.forEach(campo => {
      if (campo.obligatorio) {
        schemaFields[campo.id] = z.string().min(1, `${campo.label} es obligatorio`)
      } else {
        schemaFields[campo.id] = z.string().optional()
      }
      for (let i = 1; i <= 4; i++) {
        schemaFields[`${campo.id}_p${i}`] = z.string().optional()
      }
    })
  })
  schemaFields['informacion_adicional_ia'] = z.string().optional()
  const schema = z.object(schemaFields)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries([
      ...(def?.secciones.flatMap(s => s.campos.map(c => [c.id, ''])) ?? []),
      ...(def?.secciones.flatMap(s => s.campos.flatMap(c =>
        Array.from({ length: 4 }, (_, i) => [`${c.id}_p${i + 1}`, ''])
      )) ?? []),
      ['informacion_adicional_ia', ''],
    ]),
  })

  if (!def) return <div className="card p-6 text-slate-500">Documento no encontrado</div>

  function handleSelectCliente(cliente: Cliente, seccionId: string) {
    const matchAdicional = seccionId.match(/_p(\d+)$/)
    const sufijoForm = matchAdicional ? `_p${matchAdicional[1]}` : ''
    const seccionBase = seccionId.replace(/_p\d+$/, '')
    const nombreCompleto = `${cliente.nombre} ${cliente.apellidos}`.trim()

    const mapeosPorSeccion: Record<string, Record<string, string>> = {
      vendedor: {
        nombrevendedor: nombreCompleto,
        nombrecliente: nombreCompleto,
        dnivendedor: cliente.nif_nie ?? '',
        dnicliente: cliente.nif_nie ?? '',
        callevendedor: cliente.direccion ?? '',
        callecliente: cliente.direccion ?? '',
        municipiovendedor: cliente.municipio ?? '',
        municipiocliente: cliente.municipio ?? '',
        telefonocliente: cliente.telefono ?? '',
        mailcliente: cliente.email ?? '',
      },
      comprador: {
        nombrecomprador: nombreCompleto,
        nombrecliente: nombreCompleto,
        dnicomprador: cliente.nif_nie ?? '',
        dnicliente: cliente.nif_nie ?? '',
        callecomprador: cliente.direccion ?? '',
        callecliente: cliente.direccion ?? '',
        municipiocomprador: cliente.municipio ?? '',
        municipiocliente: cliente.municipio ?? '',
        telefonocliente: cliente.telefono ?? '',
        mailcliente: cliente.email ?? '',
      },
      arrendador: {
        nombrearrendador: nombreCompleto,
        dniarrendador: cliente.nif_nie ?? '',
        callearrendador: cliente.direccion ?? '',
        municipioarrendador: cliente.municipio ?? '',
        telefonoarrendador: cliente.telefono ?? '',
        mailarrendador: cliente.email ?? '',
        nombrepropietario: nombreCompleto,
        dnipropietario: cliente.nif_nie ?? '',
        callepropietario: cliente.direccion ?? '',
        municipiopropietario: cliente.municipio ?? '',
        propietariotelefono: cliente.telefono ?? '',
        propietariomail: cliente.email ?? '',
      },
      arrendatario: {
        nombrearrendatario: nombreCompleto,
        dniarrendatario: cliente.nif_nie ?? '',
        callearrendatario: cliente.direccion ?? '',
        municipioarrendatario: cliente.municipio ?? '',
        telefonoarrendatario: cliente.telefono ?? '',
        mailarrendatario: cliente.email ?? '',
        nombreinquilino: nombreCompleto,
        dniinquilino: cliente.nif_nie ?? '',
        calleinquilino: cliente.direccion ?? '',
        municipioinquilino: cliente.municipio ?? '',
        inquilinotelefono: cliente.telefono ?? '',
        inquilinomail: cliente.email ?? '',
      },
      cliente: {
        nombrecliente: nombreCompleto,
        dnicliente: cliente.nif_nie ?? '',
        callecliente: cliente.direccion ?? '',
        municipiocliente: cliente.municipio ?? '',
        telefonocliente: cliente.telefono ?? '',
        mailcliente: cliente.email ?? '',
      },
      avalista: {
        nombreavalista: nombreCompleto,
        dniavalista: cliente.nif_nie ?? '',
        calleavalista: cliente.direccion ?? '',
        municipioavalista: cliente.municipio ?? '',
      },
      trabajador: {
        nombretrabajador: nombreCompleto,
        dnitrabajador: cliente.nif_nie ?? '',
      },
      propietario: {
        nombrepropietario: nombreCompleto,
      },
    }

    const campos = mapeosPorSeccion[seccionBase] ?? mapeosPorSeccion['cliente']
    Object.entries(campos).forEach(([campo, valor]) => {
      if (valor !== undefined) {
        const campoFinal = sufijoForm ? `${campo}${sufijoForm}` : campo
        setValue(campoFinal as any, valor)
      }
    })

    const seccionDef = def?.secciones.find(s => s.id === seccionBase)
    const campoNombreReal = seccionDef?.campos.find(c => CAMPOS_NOMBRE.includes(c.id))?.id ?? `nombre${seccionBase}`
    const campoTratamiento = sufijoForm ? `${campoNombreReal}${sufijoForm}` : campoNombreReal
    if (cliente.tratamiento) {
      setTratamientos(prev => ({ ...prev, [campoTratamiento]: cliente.tratamiento! }))
    }

    setModalCliente(null)
    toast.success(`Datos de ${nombreCompleto} cargados`)
  }

  function handleSelectInmueble(inmueble: any) {
    const campos: Record<string, string> = {
      municipioinmueble: inmueble.ciudad ?? '',
      calleinmueble: inmueble.direccion ?? '',
      referenciacatastralinmueble: inmueble.referencia_catastral ?? '',
    }
    Object.entries(campos).forEach(([campo, valor]) => {
      if (valor) setValue(campo as any, valor)
    })
    setModalInmueble(null)
    toast.success('Datos del inmueble cargados')
  }

  async function onSubmit(data: Record<string, unknown>) {
    const datosConTratamientos = { ...data }
    Object.entries(tratamientos).forEach(([campo, trato]) => {
      if (trato) datosConTratamientos[`tratamiento_${campo}`] = trato
    })
    Object.entries(compartenDomicilio).forEach(([seccion, valor]) => {
      if (valor) datosConTratamientos[`compartendomicilio_${seccion}`] = true
    })
    setLoading(true)
    try {
      const res = await fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, subtipo, datos: datosConTratamientos }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setExito(true)
      toast.success('Documento generado correctamente')
    } catch {
      toast.error('Error al generar el documento. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  function toggleSeccion(id: string) {
    setSeccionesAbiertas(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function erroresPorSeccion(seccion: SeccionFormulario): number {
    return seccion.campos.filter(c => errors[c.id]).length
  }

  function getCamposPersonaExtra(seccion: SeccionFormulario, personaIdx: number) {
    return seccion.campos.map(c => ({
      ...c,
      id: `${c.id}_p${personaIdx}`,
      label: `${c.label}`,
      obligatorio: false,
    }))
  }

  if (exito) {
    return (
      <div className="card p-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Documento generado</h3>
        <p className="text-slate-500 mb-6 max-w-sm">
          El documento <strong>{def.titulo}</strong> se ha generado y guardado correctamente.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setExito(false)} className="btn-secondary">Crear otro documento</button>
          <a href="/documentos" className="btn-primary">Ver todos los documentos</a>
        </div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        <div className="card px-5 py-4 flex items-center gap-3">
          <div className="flex-1">
            <h2 className="font-semibold text-slate-800">{def.titulo}</h2>
            <p className="text-sm text-slate-500">{def.descripcion}</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            {def.secciones.reduce((acc, s) => acc + s.campos.filter(c => c.obligatorio).length, 0)} campos obligatorios
          </div>
        </div>

        {def.secciones.map((seccion) => {
          const abierta = seccionesAbiertas[seccion.id] ?? true
          const nErrores = erroresPorSeccion(seccion)
          const esSeccionCliente = SECCIONES_CLIENTE.includes(seccion.id)
          const esSeccionInmueble = SECCIONES_INMUEBLE.includes(seccion.id)
          const personas = nPersonas[seccion.id] ?? 1
          const esDocumentoSenal = SUBTIPOS_SENAL.includes(subtipo)

          return (
            <div key={seccion.id} className="card overflow-hidden">
              <div className="flex items-center border-b border-slate-100">
                <button type="button" onClick={() => toggleSeccion(seccion.id)}
                  className="flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800">{seccion.titulo}</h3>
                  </div>
                  {nErrores > 0 && (
                    <div className="flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      {nErrores} {nErrores === 1 ? 'error' : 'errores'}
                    </div>
                  )}
                  {abierta
                    ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {abierta && esSeccionCliente && (
                  <button type="button" onClick={() => setModalCliente(seccion.id)}
                    className="flex items-center gap-1.5 mx-2 px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors shrink-0">
                    <UserSearch className="w-3.5 h-3.5" />
                    Cliente existente
                  </button>
                )}
                {abierta && esSeccionInmueble && (
                  <button type="button" onClick={() => setModalInmueble(seccion.id)}
                    className="flex items-center gap-1.5 mx-3 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors shrink-0">
                    <Home className="w-3.5 h-3.5" />
                    Inmueble existente
                  </button>
                )}
              </div>

              {abierta && (
                <div className="px-5 pb-5">
                  {esSeccionCliente && (
                    <div className="flex items-center gap-4 mt-4 mb-2 pb-3 border-b border-slate-100 flex-wrap">
                      <label className="text-sm font-medium text-slate-600">Nº de personas</label>
                      <select
                        value={personas}
                        onChange={e => setNPersonas(prev => ({ ...prev, [seccion.id]: parseInt(e.target.value) }))}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                        ))}
                      </select>
                      {esDocumentoSenal && (
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={compartenDomicilio[seccion.id] ?? false}
                            onChange={e => setCompartenDomicilio(prev => ({ ...prev, [seccion.id]: e.target.checked }))}
                            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                          Comparten domicilio
                        </label>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-4 mt-4">
                    {seccion.campos.map(campo => {
                      const ancho = campo.ancho === 'third' ? 'col-span-12 sm:col-span-4'
                        : campo.ancho === 'half' ? 'col-span-12 sm:col-span-6'
                        : 'col-span-12'
                      const esCampoNombre = CAMPOS_NOMBRE.includes(campo.id)

                      return (
                        <div key={campo.id} className={ancho}>
                          {esCampoNombre ? (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                {campo.label}{campo.obligatorio && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              <div className="flex gap-2">
                                <select
                                  value={tratamientos[campo.id] ?? ''}
                                  onChange={e => setTratamientos(prev => ({ ...prev, [campo.id]: e.target.value }))}
                                  className="w-16 shrink-0 px-2 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                                >
                                  <option value="">—</option>
                                  <option value="Don">Don</option>
                                  <option value="Doña">Doña</option>
                                </select>
                                <input
                                  {...register(campo.id as any)}
                                  type="text"
                                  className="flex-1 min-w-0 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                              </div>
                              {errors[campo.id] && (
                                <p className="text-xs text-red-600 mt-1">{(errors[campo.id] as any)?.message}</p>
                              )}
                            </div>
                          ) : (
                            <CampoInput campo={campo} register={register} error={errors[campo.id] as any} setValue={setValue} watch={watch} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {esSeccionCliente && personas > 1 && Array.from({ length: personas - 1 }, (_, i) => i + 1).map(idx => {
                    const camposExtra = getCamposPersonaExtra(seccion, idx)
                    const seccionIdAdicional = `${seccion.id}_p${idx}`
                    return (
                      <div key={idx} className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Persona {idx + 1}</p>
                          <button
                            type="button"
                            onClick={() => setModalCliente(seccionIdAdicional)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                          >
                            <UserSearch className="w-3.5 h-3.5" />
                            Cliente existente
                          </button>
                        </div>
                        <div className="grid grid-cols-12 gap-4">
                          {camposExtra.map(campo => {
                            const ancho = campo.ancho === 'third' ? 'col-span-12 sm:col-span-4'
                              : campo.ancho === 'half' ? 'col-span-12 sm:col-span-6'
                              : 'col-span-12'
                            const esCampoNombre = CAMPOS_NOMBRE.some(n => campo.id.startsWith(n))
                            return (
                              <div key={campo.id} className={ancho}>
                                {esCampoNombre ? (
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{campo.label}</label>
                                    <div className="flex gap-2 items-center">
                                      <select
                                        value={tratamientos[campo.id] ?? ''}
                                        onChange={e => setTratamientos(prev => ({ ...prev, [campo.id]: e.target.value }))}
                                        className="w-16 shrink-0 px-2 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                                      >
                                        <option value="">—</option>
                                        <option value="Don">Don</option>
                                        <option value="Doña">Doña</option>
                                      </select>
                                      <div className="flex-1 min-w-0">
                                        <CampoInput campo={{ ...campo, label: '' }} register={register} error={undefined} setValue={setValue} watch={watch} />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <CampoInput campo={campo} register={register} error={undefined} setValue={setValue} watch={watch} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Información adicional IA</h3>
            <p className="text-xs text-slate-400 mt-0.5">Campo opcional para instrucciones o contexto adicional</p>
          </div>
          <div className="px-5 py-4">
            <textarea
              {...register('informacion_adicional_ia' as any)}
              rows={4}
              placeholder="Escribe aquí cualquier información adicional..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">* Los campos marcados son obligatorios</p>
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</> : 'Generar documento'}
          </button>
        </div>
      </form>

      {modalCliente && (
        <SelectorClienteModal
          onSelect={(c) => handleSelectCliente(c, modalCliente)}
          onClose={() => setModalCliente(null)}
        />
      )}
      {modalInmueble && (
        <SelectorInmuebleModal
          onSelect={handleSelectInmueble}
          onClose={() => setModalInmueble(null)}
        />
      )}
    </>
  )
}