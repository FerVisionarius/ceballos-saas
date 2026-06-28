// Helper para provisto/a según tratamiento
function provisto(tratamiento: string): string {
  return tratamiento === 'Doña' ? 'provista' : 'provisto'
}

export function procesarDatosPersonas(datos: Record<string, any>, subtipo?: string): Record<string, any> {
  const resultado: Record<string, any> = {}
  const personasExtra: Record<number, Record<string, any>> = {}

  for (const [key, value] of Object.entries(datos)) {
    const match = key.match(/^(.+)_p(\d+)$/)
    if (match) {
      const campoBase = match[1]
      const idx = parseInt(match[2])
      if (!personasExtra[idx]) personasExtra[idx] = {}
      if (value) personasExtra[idx][campoBase] = value
    } else {
      resultado[key] = value
    }
  }

  let nPersonas = 1
  for (const [idx, campos] of Object.entries(personasExtra)) {
    if (Object.values(campos).some(v => v)) {
      nPersonas = Math.max(nPersonas, parseInt(idx) + 1)
    }
  }
  resultado['numeropersonas'] = nPersonas

  for (const [key, value] of Object.entries(datos)) {
    if (!key.match(/_p\d+$/) && !key.startsWith('tratamiento_') && value) {
      resultado[`${key}1`] = value
    }
  }

  for (const [key, value] of Object.entries(datos)) {
    if (key.startsWith('tratamiento_') && !key.match(/_p\d+$/)) {
      resultado[`${key}1`] = value
    }
  }

  for (const [idx, campos] of Object.entries(personasExtra)) {
    const num = parseInt(idx) + 1
    for (const [campo, value] of Object.entries(campos)) {
      if (value) resultado[`${campo}${num}`] = value
    }
  }

  for (const [key, value] of Object.entries(datos)) {
    const match = key.match(/^tratamiento_(.+)_p(\d+)$/)
    if (match && value) {
      const campo = match[1]
      const num = parseInt(match[2]) + 1
      resultado[`tratamiento_${campo}${num}`] = value
    }
  }

  function contarPersonasPorCampo(campoBase: string): number {
    let max = 1
    if (resultado[campoBase]) max = 1
    for (let i = 1; i <= 4; i++) {
      if (resultado[`${campoBase}${i + 1}`]) max = i + 1
    }
    Object.keys(datos).forEach(key => {
      const match = key.match(new RegExp(`^${campoBase}_p(\\d+)$`))
      if (match && datos[key]) max = Math.max(max, parseInt(match[1]) + 1)
    })
    return max
  }

  // ── Párrafo genérico ─────────────────────────────────────────
  const lineasClientes: string[] = []
  const lineasClientesCorto: string[] = []

  for (let n = 1; n <= nPersonas; n++) {
    const tratamiento =
      resultado[`tratamiento_nombrecliente${n}`] ??
      resultado[`tratamiento_nombrevendedor${n}`] ??
      resultado[`tratamiento_nombrecomprador${n}`] ??
      resultado[`tratamiento_nombrearrendador${n}`] ??
      resultado[`tratamiento_nombrearrendatario${n}`] ??
      resultado[`tratamiento_nombrepropietario${n}`] ?? ''
    const nombre =
      resultado[`nombrecliente${n}`] ??
      resultado[`nombrevendedor${n}`] ??
      resultado[`nombrecomprador${n}`] ??
      resultado[`nombrearrendador${n}`] ??
      resultado[`nombrearrendatario${n}`] ??
      resultado[`nombrepropietario${n}`] ?? ''
    const municipio =
      resultado[`municipiocliente${n}`] ??
      resultado[`municipiovendedor${n}`] ??
      resultado[`municipiocomprador${n}`] ??
      resultado[`municipioarrendador${n}`] ??
      resultado[`municipioarrendatario${n}`] ?? ''
    const calle =
      resultado[`callecliente${n}`] ??
      resultado[`callevendedor${n}`] ??
      resultado[`callecomprador${n}`] ??
      resultado[`callearrendador${n}`] ??
      resultado[`callearrendatario${n}`] ?? ''
    const dni =
      resultado[`dnicliente${n}`] ??
      resultado[`dnivendedor${n}`] ??
      resultado[`dnicomprador${n}`] ??
      resultado[`dniarrendador${n}`] ??
      resultado[`dniarrendatario${n}`] ?? ''
    const telefono =
      resultado[`telefonocliente${n}`] ??
      resultado[`telefonovendedor${n}`] ??
      resultado[`telefonocomprador${n}`] ??
      resultado[`telefonoarrendador${n}`] ??
      resultado[`telefonoarrendatario${n}`] ?? ''
    const mail =
      resultado[`mailcliente${n}`] ??
      resultado[`mailvendedor${n}`] ??
      resultado[`mailcomprador${n}`] ??
      resultado[`mailarrendador${n}`] ??
      resultado[`mailarrendatario${n}`] ?? ''

    if (nombre) {
      const parteTelefono = telefono ? `, con teléfono ${telefono}` : ''
      const parteEmail = mail ? ` y correo electrónico ${mail}` : ''
      lineasClientes.push(
        `${tratamiento} ${nombre}, con domicilio en ${municipio}, C/ ${calle} y ${provisto(tratamiento)}/a de D.N.I. nº ${dni}${parteTelefono}${parteEmail}`
      )
      lineasClientesCorto.push(`${tratamiento} ${nombre}`)
    }
  }

  resultado['clientes'] = lineasClientes.length > 1
    ? lineasClientes.slice(0, -1).join(', ') + ' y ' + lineasClientes.at(-1)
    : lineasClientes[0] ?? ''

  resultado['clientescorto'] = lineasClientesCorto.length > 1
    ? lineasClientesCorto.slice(0, -1).join(', ') + ' y ' + lineasClientesCorto.at(-1)
    : lineasClientesCorto[0] ?? ''

  // ── Conformidad de arras ─────────────────────────────────────
  const subtiposConformidad = ['conformidad_arras_confirmatorias', 'conformidad_arras_penitenciales']
  if (subtipo && subtiposConformidad.includes(subtipo)) {
    const lineasConformidad: string[] = []
    for (let n = 1; n <= nPersonas; n++) {
      const tratamiento = resultado[`tratamiento_nombrecliente${n}`] ?? ''
      const nombre = resultado[`nombrecliente${n}`] ?? ''
      const municipio = resultado[`municipiocliente${n}`] ?? ''
      const calle = resultado[`callecliente${n}`] ?? ''
      const dni = resultado[`dnicliente${n}`] ?? ''
      if (nombre) {
        lineasConformidad.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/${calle} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
        )
      }
    }
    const propietario = nPersonas > 1 ? 'propietarios' : 'propietario'
    resultado['clientes'] = (lineasConformidad.length > 1
      ? lineasConformidad.slice(0, -1).join(', ') + ' y ' + lineasConformidad.at(-1)
      : lineasConformidad[0] ?? '') + `, ${propietario}`
  }

// ── Señales ──────────────────────────────────────────────────
const subtiposSenal = [
  'senal_arrendamiento',
  'senal_compraventa_confirmatoria',
  'senal_compraventa_confirmatoria_banco',
  'senal_compraventa_penitencial',
  'senal_compraventa_penitencial_banco',
]
if (subtipo && subtiposSenal.includes(subtipo)) {
  const lineasRecibido: string[] = []
  const lineasFicha: string[] = []

  for (let n = 1; n <= nPersonas; n++) {
    const tratamiento =
      resultado[`tratamiento_nombrecliente${n}`] ??
      resultado[`tratamiento_nombrecomprador${n}`] ?? ''
    const nombre =
      resultado[`nombrecliente${n}`] ??
      resultado[`nombrecomprador${n}`] ?? ''
    const municipio =
      resultado[`municipiocliente${n}`] ??
      resultado[`municipiocomprador${n}`] ?? ''
    const calle =
      resultado[`callecliente${n}`] ??
      resultado[`callecomprador${n}`] ?? ''
    const dni =
      resultado[`dnicliente${n}`] ??
      resultado[`dnicomprador${n}`] ?? ''
    const telefono =
      resultado[`telefonocliente${n}`] ??
      resultado[`telefonocomprador${n}`] ?? ''

    if (nombre) {
      const tratamientoMayus = tratamiento ? tratamiento.toUpperCase() : ''
      lineasRecibido.push(`${tratamientoMayus} ${nombre}`)
      lineasFicha.push(
        `Nombre y apellidos: ${nombre.toUpperCase()}\nDomicilio y población: ${municipio}, ${calle}\nD.N.I. nº ${dni}\nTeléfono: ${telefono}`
      )
    }
  }

  resultado['clientes'] = 'He recibido de ' + (lineasRecibido.length > 1
    ? lineasRecibido.slice(0, -1).join(', ') + ' y ' + lineasRecibido.at(-1)
    : lineasRecibido[0] ?? '')

  resultado['clientescorto'] = lineasFicha.join('\n\n')

  // Párrafo propietarioscorto
  const nPropietarios = contarPersonasPorCampo('nombrepropietario')
  const lineasProp: string[] = []
  for (let n = 1; n <= nPropietarios; n++) {
    const t = resultado[`tratamiento_nombrepropietario${n}`] ?? ''
    const nombre = resultado[`nombrepropietario${n}`] ?? ''
    if (nombre) lineasProp.push(`${t} ${nombre}`.trim().toUpperCase())
  }

  if (lineasProp.length === 1) {
    resultado['propietarioscorto'] = `Y LA PROPIETARIA DE LA MISMA ${lineasProp[0]}.`
  } else if (lineasProp.length > 1) {
    const todos = lineasProp.slice(0, -1).join(', ') + ' Y ' + lineasProp.at(-1)
    resultado['propietarioscorto'] = `Y LOS PROPIETARIOS DE LA MISMA ${todos}.`
  }

if (lineasProp.length === 1) {
  resultado['propietarioscorto'] = `Y LA PROPIETARIA DE LA MISMA ${lineasProp[0]}.`
} else if (lineasProp.length > 1) {
  const todos = lineasProp.slice(0, -1).join(', ') + ' Y ' + lineasProp.at(-1)
  resultado['propietarioscorto'] = `Y LOS PROPIETARIOS DE LA MISMA ${todos}.`
}
}

// ── Contratos de arras ───────────────────────────────────────
const subtiposArras = ['contrato_arras_penitencial', 'contrato_arras_confirmatoria']
if (subtipo && subtiposArras.includes(subtipo)) {
  const nCompradores = contarPersonasPorCampo('nombrecomprador')
  const nVendedores = contarPersonasPorCampo('nombrevendedor')

  const lineasCompradores: string[] = []
  const lineasCompradoresCo: string[] = []
  for (let n = 1; n <= nCompradores; n++) {
    const tratamiento = resultado[`tratamiento_nombrecomprador${n}`] ?? ''
    const nombre = resultado[`nombrecomprador${n}`] ?? ''
    const calle = resultado[`callecomprador${n}`] ?? ''
    const dni = resultado[`dnicomprador${n}`] ?? ''
    if (nombre) {
      lineasCompradores.push(
        `${tratamiento} ${nombre}, mayor de edad, con domicilio a efectos de notificación en Guadalajara, Calle ${calle} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
      )
      lineasCompradoresCo.push(`${tratamiento} ${nombre}`)
    }
  }

  const textoCompradores = lineasCompradores.length > 1
    ? lineasCompradores.slice(0, -1).join(', ') + ' y ' + lineasCompradores.at(-1)
    : lineasCompradores[0] ?? ''

  resultado['compradores'] = lineasCompradores.length > 0
    ? 'Y de otra parte, ' + textoCompradores
    : ''
  resultado['compradorescorto'] = lineasCompradoresCo.length > 1
    ? lineasCompradoresCo.slice(0, -1).join(', ') + ' y ' + lineasCompradoresCo.at(-1) + ' quienes la aceptan y compran'
    : lineasCompradoresCo.length === 1
    ? lineasCompradoresCo[0] + ' quien la acepta y compra'
    : ''

  const lineasVendedores: string[] = []
  const lineasVendedoresCo: string[] = []
  for (let n = 1; n <= nVendedores; n++) {
    const tratamiento = resultado[`tratamiento_nombrevendedor${n}`] ?? ''
    const nombre = resultado[`nombrevendedor${n}`] ?? ''
    const calle = resultado[`callevendedor${n}`] ?? ''
    const dni = resultado[`dnivendedor${n}`] ?? ''
    if (nombre) {
      lineasVendedores.push(
        `${tratamiento} ${nombre}, mayor de edad, vecino de ${calle} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
      )
      lineasVendedoresCo.push(`${tratamiento} ${nombre}`)
    }
  }

  const textoVendedores = lineasVendedores.length > 1
    ? lineasVendedores.slice(0, -1).join(', ') + ' y ' + lineasVendedores.at(-1)
    : lineasVendedores[0] ?? ''

  resultado['vendedores'] = `R E U N I D O S: De una parte, ${textoVendedores}`
  resultado['vendedorescorto'] = lineasVendedoresCo.length > 1
    ? lineasVendedoresCo.slice(0, -1).join(', ') + ' y ' + lineasVendedoresCo.at(-1)
    : lineasVendedoresCo[0] ?? ''

  // ── Solo para contrato_arras_confirmatoria: clientescortofirma y vendedorescortofirma ──
  if (subtipo === 'contrato_arras_confirmatoria') {
    resultado['clientescortofirma'] = lineasCompradoresCo.map(l => `Fdo. ${l}`).join('\n')
    resultado['vendedorescortofirma'] = lineasVendedoresCo.map(l => `Fdo. ${l}`).join('\n')
  }
}

  // ── Reconocimiento honorarios ────────────────────────────────
  if (subtipo === 'reconocimiento_honorarios') {
    const lineasRH: string[] = []
    const lineasRHCorto: string[] = []
    for (let n = 1; n <= nPersonas; n++) {
      const tratamiento = resultado[`tratamiento_nombrecliente${n}`] ?? ''
      const nombre = resultado[`nombrecliente${n}`] ?? ''
      const municipio = resultado[`municipiocliente${n}`] ?? ''
      const calle = resultado[`callecliente${n}`] ?? ''
      const numerocalle = resultado[`numerocallecliente${n}`] ?? ''
      const dni = resultado[`dnicliente${n}`] ?? ''
      if (nombre) {
        const parteNumero = numerocalle ? `, ${numerocalle}` : ''
        lineasRH.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, ${calle}${parteNumero} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
        )
        lineasRHCorto.push(`${tratamiento} ${nombre}`)
      }
    }
    resultado['clientes'] = lineasRH.length > 1
      ? lineasRH.slice(0, -1).join(', ') + ' y ' + lineasRH.at(-1)
      : lineasRH[0] ?? ''
    resultado['clientescorto'] = lineasRHCorto.length > 1
      ? lineasRHCorto.slice(0, -1).join(', ') + ' y ' + lineasRHCorto.at(-1)
      : lineasRHCorto[0] ?? ''
  }

  // ── Contratos de arrendamiento ───────────────────────────────
  const subtiposArrendamiento = ['contrato_arrendamiento', 'contrato_arrendamiento_rescision']
  if (subtipo && subtiposArrendamiento.includes(subtipo)) {
    const nArrendadores = contarPersonasPorCampo('nombrearrendador')
    const nArrendatarios = contarPersonasPorCampo('nombrearrendatario')

    const lineasArrendadores: string[] = []
    const lineasArrendadoresCo: string[] = []
    for (let n = 1; n <= nArrendadores; n++) {
      const tratamiento = resultado[`tratamiento_nombrearrendador${n}`] ?? ''
      const nombre = resultado[`nombrearrendador${n}`] ?? ''
      const municipio = resultado[`municipioarrendador${n}`] ?? ''
      const calle = resultado[`callearrendador${n}`] ?? ''
      const dni = resultado[`dniarrendador${n}`] ?? ''
      if (nombre) {
        lineasArrendadores.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/${calle} y ${provisto(tratamiento)} de D.N.I. nº.- ${dni}`
        )
        lineasArrendadoresCo.push(`${tratamiento} ${nombre}`)
      }
    }

    resultado['arrendadores'] = lineasArrendadores.length > 1
      ? lineasArrendadores.slice(0, -1).join(', ') + ' y ' + lineasArrendadores.at(-1)
      : lineasArrendadores[0] ?? ''
    resultado['arrendadorescorto'] = lineasArrendadoresCo.length > 1
      ? lineasArrendadoresCo.slice(0, -1).join(', ') + ' y ' + lineasArrendadoresCo.at(-1)
      : lineasArrendadoresCo[0] ?? ''

    const lineasArrendatarios: string[] = []
    const lineasArrendatariosCo: string[] = []
    for (let n = 1; n <= nArrendatarios; n++) {
      const tratamiento = resultado[`tratamiento_nombrearrendatario${n}`] ?? ''
      const nombre = resultado[`nombrearrendatario${n}`] ?? ''
      const municipio = resultado[`municipioarrendatario${n}`] ?? ''
      const calle = resultado[`callearrendatario${n}`] ?? ''
      const dni = resultado[`dniarrendatario${n}`] ?? ''
      if (nombre) {
        lineasArrendatarios.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/${calle} y ${provisto(tratamiento)} de D.N.I. nº.- ${dni}`
        )
        lineasArrendatariosCo.push(`${tratamiento} ${nombre}`)
      }
    }

    resultado['arrendatarios'] = lineasArrendatarios.length > 1
      ? lineasArrendatarios.slice(0, -1).join(', ') + ' y ' + lineasArrendatarios.at(-1)
      : lineasArrendatarios[0] ?? ''
    resultado['arrendatarioscorto'] = lineasArrendatariosCo.length > 1
      ? lineasArrendatariosCo.slice(0, -1).join(', ') + ' y ' + lineasArrendatariosCo.at(-1)
      : lineasArrendatariosCo[0] ?? ''
  }

  // ── ContratoArrasCompraVentaPagoAplazado ─────────────────────
  if (subtipo === 'contrato_arras_compraventa_pago_aplazado') {
    const nPropietarios = contarPersonasPorCampo('nombrepropietario')
    const nInquilinos = contarPersonasPorCampo('nombreinquilino')

    // Propietarios
    const lineasPropietarios: string[] = []
    const lineasPropietariosCo: string[] = []
    for (let n = 1; n <= nPropietarios; n++) {
      const tratamiento = resultado[`tratamiento_nombrepropietario${n}`] ?? ''
      const nombre = resultado[`nombrepropietario${n}`] ?? ''
      const municipio = resultado[`municipiopropietario${n}`] ?? ''
      const calle = resultado[`callepropietario${n}`] ?? ''
      const dni = resultado[`dnipropietario${n}`] ?? ''
      if (nombre) {
        lineasPropietarios.push(
          `${tratamiento} ${nombre}, mayores de edad, con domicilio en ${municipio}), Calle ${calle} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
        )
        lineasPropietariosCo.push(`${tratamiento} ${nombre}`)
      }
    }

    resultado['propietarios'] = lineasPropietarios.length > 1
      ? lineasPropietarios.slice(0, -1).join(', ') + ' y ' + lineasPropietarios.at(-1)
      : lineasPropietarios[0] ?? ''
    resultado['propietarioscorto'] = lineasPropietariosCo.length > 1
      ? lineasPropietariosCo.slice(0, -1).join(', ') + ' y ' + lineasPropietariosCo.at(-1)
      : lineasPropietariosCo[0] ?? ''

    // Inquilinos
    const lineasInquilinos: string[] = []
    const lineasInquilinosCo: string[] = []
    for (let n = 1; n <= nInquilinos; n++) {
      const tratamiento = resultado[`tratamiento_nombreinquilino${n}`] ?? ''
      const nombre = resultado[`nombreinquilino${n}`] ?? ''
      const municipio = resultado[`municipioinquilino${n}`] ?? ''
      const calle = resultado[`calleinquilino${n}`] ?? ''
      const dni = resultado[`dniinquilino${n}`] ?? ''
      if (nombre) {
        lineasInquilinos.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, Calle ${calle} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
        )
        lineasInquilinosCo.push(`${tratamiento} ${nombre}`)
      }
    }

    resultado['inquilinos'] = lineasInquilinos.length > 1
      ? lineasInquilinos.slice(0, -1).join(', ') + ' y ' + lineasInquilinos.at(-1)
      : lineasInquilinos[0] ?? ''
    resultado['inquilinoscorto'] = lineasInquilinosCo.length > 1
      ? lineasInquilinosCo.slice(0, -1).join(', ') + ' y ' + lineasInquilinosCo.at(-1)
      : lineasInquilinosCo[0] ?? ''
  }

  // ── ContratoArrasPromesaCompraVentaVPO ───────────────────────
  if (subtipo === 'contrato_arras_promesa_compraventa_vpo') {
    const nVendedores = contarPersonasPorCampo('nombrevendedor')
    const nCompradores = contarPersonasPorCampo('nombrecomprador')

    // Vendedores
    const lineasVendedores: string[] = []
    const lineasVendedoresCo: string[] = []
    for (let n = 1; n <= nVendedores; n++) {
      const tratamiento = resultado[`tratamiento_nombrevendedor${n}`] ?? ''
      const nombre = resultado[`nombrevendedor${n}`] ?? ''
      const municipio = resultado[`municipiovendedor${n}`] ?? ''
      const calle = resultado[`callevendedor${n}`] ?? ''
      const dni = resultado[`dnivendedor${n}`] ?? ''
      if (nombre) {
        lineasVendedores.push(
          `${tratamiento} ${nombre}, mayores de edad, con domicilio en ${municipio}), Calle ${calle} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
        )
        lineasVendedoresCo.push(`${tratamiento} ${nombre}`)
      }
    }

    resultado['vendedores'] = lineasVendedores.length > 1
      ? lineasVendedores.slice(0, -1).join(', ') + ' y ' + lineasVendedores.at(-1)
      : lineasVendedores[0] ?? ''
    resultado['vendedorescorto'] = lineasVendedoresCo.length > 1
      ? lineasVendedoresCo.slice(0, -1).join(', ') + ' y ' + lineasVendedoresCo.at(-1)
      : lineasVendedoresCo[0] ?? ''

    // Compradores
    const lineasCompradores: string[] = []
    const lineasCompradoresCo: string[] = []
    for (let n = 1; n <= nCompradores; n++) {
      const tratamiento = resultado[`tratamiento_nombrecomprador${n}`] ?? ''
      const nombre = resultado[`nombrecomprador${n}`] ?? ''
      const municipio = resultado[`municipiocomprador${n}`] ?? ''
      const calle = resultado[`callecomprador${n}`] ?? ''
      const dni = resultado[`dnicomprador${n}`] ?? ''
      if (nombre) {
        lineasCompradores.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, Calle ${calle} y ${provisto(tratamiento)} de D.N.I. nº ${dni}`
        )
        lineasCompradoresCo.push(`${tratamiento} ${nombre}`)
      }
    }

    resultado['compradores'] = lineasCompradores.length > 1
      ? lineasCompradores.slice(0, -1).join(', ') + ' y ' + lineasCompradores.at(-1)
      : lineasCompradores[0] ?? ''
    resultado['compradorescorto'] = lineasCompradoresCo.length > 1
      ? lineasCompradoresCo.slice(0, -1).join(', ') + ' y ' + lineasCompradoresCo.at(-1)
      : lineasCompradoresCo[0] ?? ''
  }

// ── ContratoArrendamientoAval ────────────────────────────────
if (subtipo === 'contrato_arrendamiento_aval') {
  const nPropietarios = contarPersonasPorCampo('nombrepropietario')
  const nInquilinos = contarPersonasPorCampo('nombreinquilino')
  const nAvalistas = contarPersonasPorCampo('nombreavalista')

  const lineasProp: string[] = []
  const lineasPropCo: string[] = []
  for (let n = 1; n <= nPropietarios; n++) {
    const t = resultado[`tratamiento_nombrepropietario${n}`] ?? ''
    const nombre = resultado[`nombrepropietario${n}`] ?? ''
    const municipio = resultado[`municipiopropietario${n}`] ?? ''
    const calle = resultado[`callepropietario${n}`] ?? ''
    const dni = resultado[`dnipropietario${n}`] ?? ''
    if (nombre) {
      lineasProp.push(`${t} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/ ${calle} y ${provisto(t)} de D.N.I. nº.- ${dni}`)
      lineasPropCo.push(`${t} ${nombre}`)
    }
  }
  resultado['propietarios'] = lineasProp.length > 1 ? lineasProp.slice(0, -1).join(', ') + ' y ' + lineasProp.at(-1) : lineasProp[0] ?? ''
  resultado['propietarioscorto'] = lineasPropCo.length > 1 ? lineasPropCo.slice(0, -1).join(', ') + ' y ' + lineasPropCo.at(-1) : lineasPropCo[0] ?? ''

  const lineasInq: string[] = []
  const lineasInqCo: string[] = []
  for (let n = 1; n <= nInquilinos; n++) {
    const t = resultado[`tratamiento_nombreinquilino${n}`] ?? ''
    const nombre = resultado[`nombreinquilino${n}`] ?? ''
    const municipio = resultado[`municipioinquilino${n}`] ?? ''
    const calle = resultado[`calleinquilino${n}`] ?? ''
    const dni = resultado[`dniinquilino${n}`] ?? ''
    if (nombre) {
      lineasInq.push(`${t} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/ ${calle} y ${provisto(t)} de D.N.I. nº.- ${dni}`)
      lineasInqCo.push(`${t} ${nombre}`)
    }
  }
  resultado['inquilinos'] = lineasInq.length > 1 ? lineasInq.slice(0, -1).join(', ') + ' y ' + lineasInq.at(-1) : lineasInq[0] ?? ''
  resultado['inquilinoscorto'] = lineasInqCo.length > 1 ? lineasInqCo.slice(0, -1).join(', ') + ' y ' + lineasInqCo.at(-1) : lineasInqCo[0] ?? ''

  const lineasAval: string[] = []
  const lineasAvalCo: string[] = []
  for (let n = 1; n <= nAvalistas; n++) {
    const t = resultado[`tratamiento_nombreavalista${n}`] ?? ''
    const nombre = resultado[`nombreavalista${n}`] ?? ''
    const municipio = resultado[`municipioavalista${n}`] ?? ''
    const calle = resultado[`calleavalista${n}`] ?? ''
    const dni = resultado[`dniavalista${n}`] ?? ''
    if (nombre) {
      lineasAval.push(`${t} ${nombre}, mayor de edad, con domicilio en ${municipio}, ${calle} y ${provisto(t)} de D.N.I. nº ${dni}`)
      lineasAvalCo.push(`${t} ${nombre}`)
    }
  }
  resultado['avalista'] = lineasAval.length > 1 ? lineasAval.slice(0, -1).join(', ') + ' y ' + lineasAval.at(-1) : lineasAval[0] ?? ''
  resultado['avalistascorto'] = lineasAvalCo.length > 1 ? lineasAvalCo.slice(0, -1).join(', ') + ' y ' + lineasAvalCo.at(-1) : lineasAvalCo[0] ?? ''
}

// ── ContratoArrendamientoTrabajadores / VPO ──────────────────
const subtiposTrabajadores = ['contrato_arrendamiento_trabajadores', 'contrato_arrendamiento_vpo']
if (subtipo && subtiposTrabajadores.includes(subtipo)) {
  const nPropietarios = contarPersonasPorCampo('nombrepropietario')
  const nInquilinos = contarPersonasPorCampo('nombreinquilino')
  const nTrabajadores = contarPersonasPorCampo('nombretrabajador')

  const lineasProp: string[] = []
  const lineasPropCo: string[] = []
  for (let n = 1; n <= nPropietarios; n++) {
    const t = resultado[`tratamiento_nombrepropietario${n}`] ?? ''
    const nombre = resultado[`nombrepropietario${n}`] ?? ''
    const municipio = resultado[`municipiopropietario${n}`] ?? ''
    const calle = resultado[`callepropietario${n}`] ?? ''
    const dni = resultado[`dnipropietario${n}`] ?? ''
    if (nombre) {
      lineasProp.push(`${t} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/ ${calle} y ${provisto(t)} de D.N.I. nº.- ${dni}`)
      lineasPropCo.push(`${t} ${nombre}`)
    }
  }
  resultado['propietarios'] = lineasProp.length > 1 ? lineasProp.slice(0, -1).join(', ') + ' y ' + lineasProp.at(-1) : lineasProp[0] ?? ''
  resultado['propietarioscorto'] = lineasPropCo.length > 1 ? lineasPropCo.slice(0, -1).join(', ') + ' y ' + lineasPropCo.at(-1) : lineasPropCo[0] ?? ''

  const lineasInq: string[] = []
  const lineasInqCo: string[] = []
  for (let n = 1; n <= nInquilinos; n++) {
    const t = resultado[`tratamiento_nombreinquilino${n}`] ?? ''
    const nombre = resultado[`nombreinquilino${n}`] ?? ''
    const municipio = resultado[`municipioinquilino${n}`] ?? ''
    const calle = resultado[`calleinquilino${n}`] ?? ''
    const dni = resultado[`dniinquilino${n}`] ?? ''
    if (nombre) {
      lineasInq.push(`${t} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/ ${calle} y ${provisto(t)} de D.N.I. nº.- ${dni}`)
      lineasInqCo.push(`${t} ${nombre}`)
    }
  }
  resultado['inquilinos'] = lineasInq.length > 1 ? lineasInq.slice(0, -1).join(', ') + ' y ' + lineasInq.at(-1) : lineasInq[0] ?? ''
  resultado['inquilinoscorto'] = lineasInqCo.length > 1 ? lineasInqCo.slice(0, -1).join(', ') + ' y ' + lineasInqCo.at(-1) : lineasInqCo[0] ?? ''

  // Trabajadores: "del trabajador Don X, provisto de D.N.I. nº Y" / "de los trabajadores Don X provisto…, Don Y provisto…"
  const lineasTrab: string[] = []
  for (let n = 1; n <= nTrabajadores; n++) {
    const t = resultado[`tratamiento_nombretrabajador${n}`] ?? ''
    const nombre = resultado[`nombretrabajador${n}`] ?? ''
    const dni = resultado[`dnitrabajador${n}`] ?? ''
    if (nombre) {
      lineasTrab.push(`${t} ${nombre}, ${provisto(t)} de D.N.I. nº ${dni}`)
    }
  }

  if (lineasTrab.length === 1) {
    resultado['trabajadores'] = `del trabajador ${lineasTrab[0]}`
  } else if (lineasTrab.length > 1) {
    resultado['trabajadores'] = `de los trabajadores ${lineasTrab.join(', ')}`
  } else {
    resultado['trabajadores'] = ''
  }
}

  return resultado
}