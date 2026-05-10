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

  // Párrafo especial para conformidad de arras
  const subtiposConformidad = ['conformidad_arras_confirmatorias', 'conformidad_arras_penitenciales']
  if (subtipo && subtiposConformidad.includes(subtipo)) {
    const lineasConformidad: string[] = []
    for (let n = 1; n <= nPersonas; n++) {
      const tratamiento =
        resultado[`tratamiento_nombrecliente${n}`] ?? ''
      const nombre =
        resultado[`nombrecliente${n}`] ?? ''
      const municipio =
        resultado[`municipiocliente${n}`] ?? ''
      const calle =
        resultado[`callecliente${n}`] ?? ''
      const dni =
        resultado[`dnicliente${n}`] ?? ''

      if (nombre) {
        lineasConformidad.push(
          `${tratamiento} ${nombre}, mayor de edad, con domicilio en ${municipio}, C/${calle} y provisto/a de D.N.I. nº ${dni}`
        )
      }
    }


    // Párrafo especial para señales
  const subtiposSenal = [
    'senal_arrendamiento',
    'senal_compraventa_confirmatoria',
    'senal_compraventa_confirmatoria_banco',
    'senal_compraventa_penitencial',
    'senal_compraventa_penitencial_banco',
  ]
  if (subtipo && subtiposSenal.includes(subtipo)) {
    // {{clientes}} → HE RECIBIDO DE DON/DOÑA nombre...
    const lineasRecibido: string[] = []
    // {{clientescorto}} → ficha con datos
    const lineasFicha: string[] = []

    for (let n = 1; n <= nPersonas; n++) {
      const tratamiento =
        resultado[`tratamiento_nombrecliente${n}`] ??
        resultado[`tratamiento_nombrecomprador${n}`] ??
        ''
      const nombre =
        resultado[`nombrecliente${n}`] ??
        resultado[`nombrecomprador${n}`] ??
        ''
      const municipio =
        resultado[`municipiocliente${n}`] ??
        resultado[`municipiocomprador${n}`] ??
        ''
      const calle =
        resultado[`callecliente${n}`] ??
        resultado[`callecomprador${n}`] ??
        ''
      const numerocalle =
        resultado[`numerocallecliente${n}`] ??
        resultado[`numerocallecomprador${n}`] ??
        ''
      const dni =
        resultado[`dnicliente${n}`] ??
        resultado[`dnicomprador${n}`] ??
        ''
      const telefono =
        resultado[`telefonocliente${n}`] ??
        resultado[`telefonocomprador${n}`] ??
        ''

      if (nombre) {
        // Tratamiento en mayúsculas para "HE RECIBIDO DE DON..."
        const tratamientoMayus = tratamiento ? tratamiento.toUpperCase() : ''
        lineasRecibido.push(`${tratamientoMayus} ${nombre}`)

        lineasFicha.push(
          `Nombre y apellidos: ${nombre}\nDomicilio y población: ${municipio}, ${calle}${numerocalle ? ', ' + numerocalle : ''}\nD.N.I. nº ${dni}\nTeléfono: ${telefono}`
        )
      }
    }

    resultado['clientes'] = 'HE RECIBIDO DE ' + (lineasRecibido.length > 1
      ? lineasRecibido.slice(0, -1).join(', ') + ' y ' + lineasRecibido.at(-1)
      : lineasRecibido[0] ?? '')

    resultado['clientescorto'] = lineasFicha.join('\n\n')
  }

    const propietario = nPersonas > 1 ? 'propietarios' : 'propietario'
    resultado['clientes'] = (lineasConformidad.length > 1
      ? lineasConformidad.slice(0, -1).join(', ') + ' y ' + lineasConformidad.at(-1)
      : lineasConformidad[0] ?? '') + `, ${propietario}`
  }

  return resultado
}