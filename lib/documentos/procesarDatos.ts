export function procesarDatosPersonas(datos: Record<string, any>): Record<string, any> {
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
    for (let n = 1; n <= nPersonas; n++) {
      const tratamiento = resultado[`tratamiento_nombrecliente${n}`] ?? resultado[`tratamiento_nombrevendedor${n}`] ?? resultado[`tratamiento_nombrecomprador${n}`] ?? ''
      const nombre = resultado[`nombrecliente${n}`] ?? resultado[`nombrevendedor${n}`] ?? resultado[`nombrecomprador${n}`] ?? ''
      const municipio = resultado[`municipiocliente${n}`] ?? ''
      const calle = resultado[`callecliente${n}`] ?? ''
      const dni = resultado[`dnicliente${n}`] ?? resultado[`dnivendedor${n}`] ?? resultado[`dnicomprador${n}`] ?? ''
      const telefono = resultado[`telefonocliente${n}`] ?? ''
      const mail = resultado[`mailcliente${n}`] ?? ''
  
      if (nombre) {
        const parteTelefono = telefono ? `, con teléfono ${telefono}` : ''
        const parteEmail = mail ? ` y correo electrónico ${mail}` : ''
        lineasClientes.push(
          `${tratamiento} ${nombre}, con domicilio en ${municipio}, C/ ${calle} y provisto/a de D.N.I. nº ${dni}${parteTelefono}${parteEmail}`
        )
      }
    }
    resultado['clientes'] = lineasClientes.join(' y ')
  
    return resultado
  }