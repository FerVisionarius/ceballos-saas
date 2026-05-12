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

  // ── Helpers para contar personas por campo base ──────────────
  function contarPersonasPorCampo(campoBase: string): number {
    let max = 1
    if (resultado[campoBase]) max = 1
    for (let i = 1; i <= 4; i++) {
      if (resultado[`${campoBase}${i + 1}`]) max = i + 1
    }
    // También contar desde _p sufijos procesados
    Object.keys(datos).forEach(key => {
      const match = key.match(new RegExp(`^${campoBase}_p(\\d+)$`))
      if (match && datos[key]) max = Math.max(max, parseInt(match[1]) + 1)
    })
    return max
  }

  // ── Párrafo genérico (clientes + clientescorto) ──────────────
  const lineasClientes: string[] = []
  const lineasClientesCorto: string[] = []

  for (let n = 1; n <= nPersonas; n++) {
    const tratamiento =
      resultado[`tratamiento_nombrecliente${n}`] ??
      resultado[`tratamiento_nombrevendedor${n}`] ??
      resultado[`tratamiento_nombrecomprador${n}`] ??
      resultado[`tratamiento_nombrearrendador${n}`] ??
      resultado[`tratamiento_nombrearrendatario${n}`] ??
      resultado[`tratamiento_nombrepropietario${n}`] ??
      ''
    const nombre =
      resultado[`nombrecliente${n}`] ??
      resultado[`nombrevendedor${n}`] ??
      resultado[`nombrecomprador${n}`] ??
      resultado[`nombrearrendador${n}`] ??
      resultado[`nombrearrendatario${n}`] ??
      resultado[`nombrepropietario${n}`] ??
      ''
    const municipio =
      resultado[`municipiocliente${n}`] ??
      resultado[`municipiovendedor${n}`] ??
      resultado[`municipiocomprador${n}`] ??
      resultado[`municipioarrendador${n}`] ??
      resultado[`municipioarrendatario${n}`] ??
      ''
    const calle =
      resultado[`callecliente${n}`] ??
      resultado[`callevendedor${n}`] ??
      resultado[`callecomprador${n}`] ??
      resultado[`callearrendador${n}`] ??
      resultado[`callearrendatario${n}`] ??
      ''
    const dni =
      resultado[`dnicliente${n}`] ??
      resultado[`dnivendedor${n}`] ??
      resultado[`dnicomprador${n}`] ??
      resultado[`dniarrendador${n}`] ??
      resultado[`dniarrendatario${n}`] ??
      ''
    const telefono =
      resultado[`telefonocliente${n}`] ??
      resultado[`telefonovendedor${n}`] ??
      resultado[`telefonocomprador${n}`] ??
      resultado[`telefonoarrendador${n}`] ??
      resultado[`telefonoarrendatario${n}`] ??
      ''
    const mail =
      resultado[`mailcliente${n}`] ??
      resultado[`mailvendedor${n}`] ??
      resultado[`mailcomprador${n}`] ??
      resultado[`mailarrendador${n}`] ??
      resultado[`mailarrendatario${n}`] ??
      ''

    if (nombre) {
      const parteTelefono = telefono ? `, con teléfono ${telefono}` : ''
      const parteEmail = mail ? ` y correo electrónico ${mail}` : ''
      lineasClientes.push(
        `${tratamiento} ${nombre}, con domicilio en ${municipio}, C/ ${calle} y provisto/a de D.N.I. nº ${dni}${parteTelefono}${parteEmail}`
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

  // ── Párrafo especial: conformidad de arras ───────────────────
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
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/${calle} y provisto/a de D.N.I. nº ${dni}`
        )
      }
    }
    const propietario = nPersonas > 1 ? 'propietarios' : 'propietario'
    resultado['clientes'] = (lineasConformidad.length > 1
      ? lineasConformidad.slice(0, -1).join(', ') + ' y ' + lineasConformidad.at(-1)
      : lineasConformidad[0] ?? '') + `, ${propietario}`
  }

  // ── Párrafo especial: señales ────────────────────────────────
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
      const numerocalle =
        resultado[`numerocallecliente${n}`] ??
        resultado[`numerocallecomprador${n}`] ?? ''
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
          `Nombre y apellidos: ${nombre}\nDomicilio y población: ${municipio}, ${calle}${numerocalle ? ', ' + numerocalle : ''}\nD.N.I. nº ${dni}\nTeléfono: ${telefono}`
        )
      }
    }

    resultado['clientes'] = 'He recibido de ' + (lineasRecibido.length > 1
      ? lineasRecibido.slice(0, -1).join(', ') + ' y ' + lineasRecibido.at(-1)
      : lineasRecibido[0] ?? '')

    resultado['clientescorto'] = lineasFicha.join('\n\n')
  }

  // ── Párrafo especial: contratos de arras ─────────────────────
  const subtiposArras = ['contrato_arras_penitencial', 'contrato_arras_confirmatoria']
  if (subtipo && subtiposArras.includes(subtipo)) {

    // Contar compradores y vendedores por separado
    const nCompradores = contarPersonasPorCampo('nombrecomprador')
    const nVendedores = contarPersonasPorCampo('nombrevendedor')

    // Compradores
    const lineasCompradores: string[] = []
    const lineasCompradoresCo: string[] = []
    for (let n = 1; n <= nCompradores; n++) {
      const tratamiento = resultado[`tratamiento_nombrecomprador${n}`] ?? ''
      const nombre = resultado[`nombrecomprador${n}`] ?? ''
      const calle = resultado[`callecomprador${n}`] ?? ''
      const dni = resultado[`dnicomprador${n}`] ?? ''
      if (nombre) {
        lineasCompradores.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio a efectos de notificación en Guadalajara, Calle ${calle} y provisto/a de D.N.I. nº ${dni}`
        )
        lineasCompradoresCo.push(`${tratamiento} ${nombre}`)
      }
    }

    const textoCompradores = lineasCompradores.length > 1
      ? lineasCompradores.slice(0, -1).join(', ') + ' y ' + lineasCompradores.at(-1)
      : lineasCompradores[0] ?? ''

    resultado['compradores'] = `R E U N I D O S: De una parte, ${textoCompradores}`
    resultado['compradorescorto'] = lineasCompradoresCo.length > 1
      ? lineasCompradoresCo.slice(0, -1).join(', ') + ' y ' + lineasCompradoresCo.at(-1)
      : lineasCompradoresCo[0] ?? ''

    // Vendedores
    const lineasVendedores: string[] = []
    const lineasVendedoresCo: string[] = []
    for (let n = 1; n <= nVendedores; n++) {
      const tratamiento = resultado[`tratamiento_nombrevendedor${n}`] ?? ''
      const nombre = resultado[`nombrevendedor${n}`] ?? ''
      const calle = resultado[`callevendedor${n}`] ?? ''
      const dni = resultado[`dnivendedor${n}`] ?? ''
      if (nombre) {
        lineasVendedores.push(
          `${tratamiento} ${nombre}, mayor de edad, vecino de ${calle} y provisto/a de D.N.I. nº ${dni}`
        )
        lineasVendedoresCo.push(`${tratamiento} ${nombre}`)
      }
    }

    resultado['vendedores'] = lineasVendedores.length > 0
      ? 'Y de otra parte, ' + (lineasVendedores.length > 1
        ? lineasVendedores.slice(0, -1).join(', ') + ' y ' + lineasVendedores.at(-1)
        : lineasVendedores[0])
      : ''

    resultado['vendedorescorto'] = lineasVendedoresCo.length > 1
      ? lineasVendedoresCo.slice(0, -1).join(', ') + ' y ' + lineasVendedoresCo.at(-1)
      : lineasVendedoresCo[0] ?? ''
  }

  return resultado
}