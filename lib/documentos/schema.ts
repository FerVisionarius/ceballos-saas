// ============================================================
// SCHEMA COMPLETO DE DOCUMENTOS - Inmobiliaria Ceballos
// Define los campos de cada uno de los 15 tipos de documento
// ============================================================

import type {
  DefinicionDocumento,
  GrupoTipoDocumento,
  SeccionFormulario,
} from '@/types'

// ── Secciones reutilizables ──────────────────────────────────

const SECCION_VENDEDOR: SeccionFormulario = {
  id: 'vendedor',
  titulo: 'Datos del vendedor / propietario',
  campos: [
    { id: 'vendedor_nombre', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'vendedor_nif', label: 'NIF / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
    { id: 'vendedor_municipio', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'vendedor_calle', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'vendedor_telefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
    { id: 'vendedor_email', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
  ],
}

const SECCION_COMPRADOR: SeccionFormulario = {
  id: 'comprador',
  titulo: 'Datos del comprador',
  campos: [
    { id: 'comprador_nombre', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'comprador_nif', label: 'NIF / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
    { id: 'comprador_telefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
    { id: 'comprador_email', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
    { id: 'comprador_direccion', label: 'Dirección', tipo: 'text', obligatorio: false, ancho: 'full' },
  ],
}

const SECCION_ARRENDADOR: SeccionFormulario = {
  id: 'arrendador',
  titulo: 'Datos del arrendador (propietario)',
  campos: [
    { id: 'arrendador_nombre', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'arrendador_nif', label: 'NIF / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
    { id: 'arrendador_telefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
    { id: 'arrendador_email', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
  ],
}

const SECCION_ARRENDATARIO: SeccionFormulario = {
  id: 'arrendatario',
  titulo: 'Datos del arrendatario (inquilino)',
  campos: [
    { id: 'arrendatario_nombre', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'arrendatario_nif', label: 'NIF / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
    { id: 'arrendatario_telefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
    { id: 'arrendatario_email', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
  ],
}

const SECCION_INMUEBLE_COMPRAVENTA: SeccionFormulario = {
  id: 'inmueble',
  titulo: 'Datos del inmueble',
  campos: [
    { id: 'inmueble_direccion', label: 'Dirección completa', tipo: 'text', obligatorio: true, ancho: 'full' },
    { id: 'inmueble_ciudad', label: 'Ciudad / Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'inmueble_cp', label: 'Código postal', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'inmueble_referencia_catastral', label: 'Referencia catastral', tipo: 'text', obligatorio: false, ancho: 'half' },
    { id: 'inmueble_registro', label: 'Datos registro de la propiedad', tipo: 'text', obligatorio: false, ancho: 'half', ayuda: 'Tomo, libro, folio, finca...' },
    {
      id: 'inmueble_tipo',
      label: 'Tipo de inmueble',
      tipo: 'select',
      obligatorio: true,
      ancho: 'third',
      opciones: [
        { value: 'piso', label: 'Piso / Apartamento' },
        { value: 'casa', label: 'Casa / Chalet' },
        { value: 'local', label: 'Local comercial' },
        { value: 'garaje', label: 'Garaje / Plaza' },
        { value: 'solar', label: 'Solar / Terreno' },
        { value: 'otro', label: 'Otro' },
      ],
    },
    { id: 'inmueble_metros', label: 'Metros cuadrados', tipo: 'number', obligatorio: false, ancho: 'third', sufijo: 'm²' },
    { id: 'inmueble_cargas', label: 'Cargas o gravámenes', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Hipotecas, embargos, servidumbres... Dejar en blanco si está libre de cargas.' },
  ],
}

const SECCION_INMUEBLE_ALQUILER: SeccionFormulario = {
  id: 'inmueble',
  titulo: 'Datos del inmueble en alquiler',
  campos: [
    { id: 'inmueble_direccion', label: 'Dirección completa', tipo: 'text', obligatorio: true, ancho: 'full' },
    { id: 'inmueble_ciudad', label: 'Ciudad / Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'inmueble_cp', label: 'Código postal', tipo: 'text', obligatorio: true, ancho: 'half' },
    {
      id: 'inmueble_tipo',
      label: 'Tipo de inmueble',
      tipo: 'select',
      obligatorio: true,
      ancho: 'half',
      opciones: [
        { value: 'vivienda', label: 'Vivienda habitual' },
        { value: 'temporal', label: 'Uso temporal' },
        { value: 'local', label: 'Local comercial' },
        { value: 'otro', label: 'Otro' },
      ],
    },
    { id: 'inmueble_metros', label: 'Metros cuadrados', tipo: 'number', obligatorio: false, ancho: 'half', sufijo: 'm²' },
    { id: 'inmueble_habitaciones', label: 'Habitaciones', tipo: 'number', obligatorio: false, ancho: 'third' },
    { id: 'inmueble_banos', label: 'Baños', tipo: 'number', obligatorio: false, ancho: 'third' },
    { id: 'inmueble_extras', label: 'Extras incluidos', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Garaje, trastero, muebles...' },
  ],
}

const SECCION_AGENCIA: SeccionFormulario = {
  id: 'agencia',
  titulo: 'Datos de la agencia',
  campos: [
    { id: 'agencia_nombre', label: 'Nombre agencia', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'agencia_cif', label: 'CIF', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'agencia_agente', label: 'Nombre del agente', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'agencia_telefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
    { id: 'agencia_email', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
    { id: 'agencia_api', label: 'Nº API / Registro', tipo: 'text', obligatorio: false, ancho: 'half' },
  ],
}

// ── Definiciones de los 15 documentos ───────────────────────

export const SCHEMA_DOCUMENTOS: DefinicionDocumento[] = [

// 1. NOTA DE ENCARGO EXCLUSIVA
{
  tipo: 'nota_encargo',
  subtipo: 'nota_encargo_exclusiva',
  titulo: 'Nota de Encargo en Exclusiva',
  descripcion: 'Encargo exclusivo de venta o alquiler a la agencia',
  secciones: [
    SECCION_VENDEDOR,
    {
      id: 'inmueble',
      titulo: 'Datos del inmueble',
      campos: [
        { id: 'inmueble_direccion', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'full' },
        { id: 'inmueble_garaje', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'inmueble_trastero', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'inmueble_ciudad', label: 'Ciudad', tipo: 'text', obligatorio: true, ancho: 'third' },
        { id: 'inmueble_registro_lugar', label: 'Registro de la Propiedad (lugar)', tipo: 'text', obligatorio: false, ancho: 'half' },
        { id: 'inmueble_registro_tomo', label: 'Tomo', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'inmueble_registro_libro', label: 'Libro', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'inmueble_registro_folio', label: 'Folio', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'inmueble_registro_finca', label: 'Finca', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'hipoteca_pendiente', label: 'Hipoteca pendiente (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€', ayuda: 'Dejar vacío si está libre de cargas' },
      ],
    },
    {
      id: 'condiciones',
      titulo: 'Condiciones del encargo',
      campos: [
        { id: 'precio_venta', label: 'Precio de venta (número)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
        { id: 'precio_venta_letra', label: 'Precio de venta (en letra)', tipo: 'text', obligatorio: true, ancho: 'half', placeholder: 'Doscientos cincuenta mil' },
        { id: 'duracion_meses', label: 'Duración del encargo (meses)', tipo: 'number', obligatorio: true, ancho: 'third' },
        { id: 'honorarios_porcentaje', label: 'Comisión (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
        { id: 'honorarios_minimo', label: 'Mínimo honorarios (€)', tipo: 'currency', obligatorio: true, ancho: 'third', prefijo: '€' },
        { id: 'condiciones_especiales', label: 'Condiciones especiales', tipo: 'textarea', obligatorio: false, ancho: 'full' },
      ],
    },
    SECCION_AGENCIA,
  ],
},

// 2. NOTA DE ENCARGO SIN EXCLUSIVA
{
  tipo: 'nota_encargo',
  subtipo: 'nota_encargo_sin_exclusiva',
  titulo: 'Nota de Encargo sin Exclusiva',
  descripcion: 'Encargo de venta o alquiler sin exclusividad',
  secciones: [
    SECCION_VENDEDOR,
    {
      id: 'inmueble',
      titulo: 'Datos del inmueble',
      campos: [
        { id: 'inmueble_direccion', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'full' },
        { id: 'inmueble_garaje', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'inmueble_trastero', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
        { id: 'inmueble_ciudad', label: 'Ciudad / Municipio', tipo: 'text', obligatorio: true, ancho: 'third' },
        { id: 'hipoteca_pendiente', label: 'Hipoteca pendiente (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€', ayuda: 'Dejar vacío si está libre de cargas' },
      ],
    },
    {
      id: 'condiciones',
      titulo: 'Condiciones del encargo',
      campos: [
        { id: 'precio_venta', label: 'Precio de venta (número)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
        { id: 'precio_venta_letra', label: 'Precio de venta (en letra)', tipo: 'text', obligatorio: true, ancho: 'half', placeholder: 'Doscientos cincuenta mil' },
        { id: 'duracion_meses', label: 'Duración del encargo (meses)', tipo: 'number', obligatorio: true, ancho: 'third' },
        { id: 'honorarios_porcentaje', label: 'Comisión (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
        { id: 'honorarios_minimo', label: 'Mínimo honorarios (número)', tipo: 'currency', obligatorio: true, ancho: 'third', prefijo: '€' },
        { id: 'honorarios_minimo_letra', label: 'Mínimo honorarios (en letra)', tipo: 'text', obligatorio: true, ancho: 'half', placeholder: 'Tres mil' },
        { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
      ],
    },
    SECCION_AGENCIA,
  ],
},

  // 3. CONFORMIDAD ARRAS CONFIRMATORIAS
  {
    tipo: 'documento_conformidad',
    subtipo: 'conformidad_arras_confirmatorias',
    titulo: 'Conformidad de Arras Confirmatorias',
    descripcion: 'Documento de conformidad previo a contrato de arras confirmatorias',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones_compraventa',
        titulo: 'Condiciones de la compraventa',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_arras', label: 'Importe de arras', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fecha_firma_prevista', label: 'Fecha prevista de firma notarial', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'notario', label: 'Notario / Notaría prevista', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'forma_pago', label: 'Forma de pago', tipo: 'textarea', obligatorio: true, ancho: 'full', ayuda: 'Describir: entrega inicial, hipoteca, resto en escritura...' },
          { id: 'condiciones_especiales', label: 'Condiciones especiales / Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 4. CONFORMIDAD ARRAS PENITENCIALES
  {
    tipo: 'documento_conformidad',
    subtipo: 'conformidad_arras_penitenciales',
    titulo: 'Conformidad de Arras Penitenciales',
    descripcion: 'Documento de conformidad previo a contrato de arras penitenciales',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones_compraventa',
        titulo: 'Condiciones de la compraventa',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_arras', label: 'Importe de arras (señal)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fecha_firma_prevista', label: 'Fecha prevista de firma notarial', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'plazo_dias', label: 'Plazo en días para escritura', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'penalizacion_comprador', label: 'Penalización si desiste el comprador', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Por defecto: pierde las arras entregadas' },
          { id: 'penalizacion_vendedor', label: 'Penalización si desiste el vendedor', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Por defecto: devuelve el doble de las arras' },
          { id: 'forma_pago', label: 'Forma de pago', tipo: 'textarea', obligatorio: true, ancho: 'full' },
          { id: 'condiciones_especiales', label: 'Condiciones especiales', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 5. SEÑAL ARRENDAMIENTO
  {
    tipo: 'documento_senal',
    subtipo: 'senal_arrendamiento',
    titulo: 'Documento de Señal para Arrendamiento',
    descripcion: 'Reserva mediante señal para contrato de alquiler',
    secciones: [
      SECCION_ARRENDADOR,
      SECCION_ARRENDATARIO,
      SECCION_INMUEBLE_ALQUILER,
      {
        id: 'condiciones_senal',
        titulo: 'Condiciones de la señal',
        campos: [
          { id: 'importe_senal', label: 'Importe de la señal', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'renta_mensual', label: 'Renta mensual acordada', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fecha_inicio_contrato', label: 'Fecha prevista inicio contrato', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'duracion_contrato', label: 'Duración del contrato', tipo: 'text', obligatorio: true, ancho: 'half', placeholder: 'Ej: 1 año, 5 años...' },
          { id: 'fianza', label: 'Fianza (mensualidades)', tipo: 'number', obligatorio: true, ancho: 'third' },
          { id: 'forma_pago_senal', label: 'Forma de pago señal', tipo: 'select', obligatorio: true, ancho: 'third', opciones: [
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'cheque', label: 'Cheque' },
          ]},
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 6. SEÑAL COMPRAVENTA CONFIRMATORIA
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_confirmatoria',
    titulo: 'Señal Compraventa Confirmatoria',
    descripcion: 'Entrega de señal en compraventa con arras confirmatorias',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_senal', label: 'Importe de la señal entregada', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fecha_entrega', label: 'Fecha de entrega de la señal', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'forma_pago', label: 'Forma de pago señal', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'cheque', label: 'Cheque bancario' },
          ]},
          { id: 'fecha_firma_notarial', label: 'Fecha prevista escritura', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'resto_precio', label: 'Resto a pagar en escritura', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 7. SEÑAL COMPRAVENTA CONFIRMATORIA INGRESO BANCO
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_confirmatoria_banco',
    titulo: 'Señal Compraventa Confirmatoria — Ingreso Banco',
    descripcion: 'Señal confirmatoria con ingreso en cuenta bancaria de la agencia',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_senal', label: 'Importe de la señal', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'cuenta_bancaria_iban', label: 'IBAN cuenta de ingreso', tipo: 'text', obligatorio: true, ancho: 'full', placeholder: 'ES00 0000 0000 0000 0000 0000' },
          { id: 'titular_cuenta', label: 'Titular de la cuenta', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'fecha_limite_ingreso', label: 'Fecha límite de ingreso', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'fecha_firma_notarial', label: 'Fecha prevista escritura', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 8. SEÑAL COMPRAVENTA PENITENCIAL INGRESO BANCO
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_penitencial_banco',
    titulo: 'Señal Compraventa Penitencial — Ingreso Banco',
    descripcion: 'Señal penitencial con ingreso en cuenta bancaria de la agencia',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas y penalizaciones',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_senal', label: 'Importe de la señal', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'cuenta_bancaria_iban', label: 'IBAN cuenta de ingreso', tipo: 'text', obligatorio: true, ancho: 'full', placeholder: 'ES00 0000 0000 0000 0000 0000' },
          { id: 'titular_cuenta', label: 'Titular de la cuenta', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'fecha_limite_ingreso', label: 'Fecha límite de ingreso', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'plazo_firma_dias', label: 'Plazo para firma (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'penalizacion_info', label: 'Cláusula de penalización', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Comprador pierde señal / Vendedor devuelve el doble' },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 9. SEÑAL COMPRAVENTA PENITENCIAL
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_penitencial',
    titulo: 'Señal Compraventa Penitencial',
    descripcion: 'Entrega de señal en compraventa con carácter penitencial',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones',
        titulo: 'Condiciones y penalizaciones',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_senal', label: 'Importe de la señal', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'forma_pago', label: 'Forma de pago', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'cheque', label: 'Cheque bancario' },
          ]},
          { id: 'fecha_entrega', label: 'Fecha de entrega', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'plazo_firma_dias', label: 'Plazo para firma escritura (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fecha_firma_limite', label: 'Fecha límite escritura', tipo: 'date', obligatorio: false, ancho: 'half' },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 10. SEÑAL OFERTA
  {
    tipo: 'documento_senal',
    subtipo: 'senal_oferta',
    titulo: 'Documento de Señal / Oferta',
    descripcion: 'Formalización de oferta de compra con entrega de señal',
    secciones: [
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'oferta',
        titulo: 'Condiciones de la oferta',
        campos: [
          { id: 'precio_oferta', label: 'Precio ofertado', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_senal', label: 'Importe señal entregada', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'forma_pago_senal', label: 'Forma de pago señal', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'cheque', label: 'Cheque bancario' },
          ]},
          { id: 'validez_oferta_dias', label: 'Validez de la oferta (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'condiciones_oferta', label: 'Condiciones específicas de la oferta', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Condiciones suspensivas, hipoteca, reforma...' },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 11. CONTRATO DE ARRAS PENITENCIAL
  {
    tipo: 'contrato_arras',
    subtipo: 'contrato_arras_penitencial',
    titulo: 'Contrato de Arras Penitenciales',
    descripcion: 'Contrato de arras con carácter penitencial (art. 1454 CC)',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones_arras',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_arras', label: 'Importe de las arras', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'forma_pago_arras', label: 'Forma de pago arras', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'cheque', label: 'Cheque bancario' },
          ]},
          { id: 'plazo_escritura_dias', label: 'Plazo para escritura (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fecha_escritura_limite', label: 'Fecha límite escritura', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'notario', label: 'Notaría designada', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'resto_precio_detalle', label: 'Detalle del resto del precio', tipo: 'textarea', obligatorio: true, ancho: 'full', ayuda: 'Cómo se pagará el resto: efectivo, hipoteca, subrogación...' },
          { id: 'cargas_estado', label: 'Estado de cargas del inmueble', tipo: 'textarea', obligatorio: true, ancho: 'full' },
          { id: 'clausulas_adicionales', label: 'Cláusulas adicionales', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 12. CONTRATO DE ARRAS CONFIRMATORIA
  {
    tipo: 'contrato_arras',
    subtipo: 'contrato_arras_confirmatoria',
    titulo: 'Contrato de Arras Confirmatorias',
    descripcion: 'Contrato de arras con carácter confirmatorio',
    secciones: [
      SECCION_VENDEDOR,
      SECCION_COMPRADOR,
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'condiciones_arras',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precio_total', label: 'Precio total de compraventa', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importe_arras', label: 'Importe de las arras confirmatorias', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'forma_pago_arras', label: 'Forma de pago', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'cheque', label: 'Cheque bancario' },
          ]},
          { id: 'fecha_escritura', label: 'Fecha escritura pública', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'notario', label: 'Notaría', tipo: 'text', obligatorio: false, ancho: 'full' },
          { id: 'resto_precio_detalle', label: 'Forma de pago del resto', tipo: 'textarea', obligatorio: true, ancho: 'full' },
          { id: 'clausulas_adicionales', label: 'Cláusulas adicionales', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 13. RECONOCIMIENTO DE HONORARIOS
  {
    tipo: 'reconocimiento_honorarios',
    subtipo: 'reconocimiento_honorarios',
    titulo: 'Reconocimiento de Honorarios',
    descripcion: 'Documento de reconocimiento y aceptación de honorarios de agencia',
    secciones: [
      {
        id: 'cliente',
        titulo: 'Datos del cliente',
        campos: [
          { id: 'cliente_nombre', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cliente_nif', label: 'NIF / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'cliente_telefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'cliente_email', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
          { id: 'cliente_tipo', label: 'Tipo de cliente', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'comprador', label: 'Comprador' },
            { value: 'vendedor', label: 'Vendedor' },
            { value: 'arrendatario', label: 'Arrendatario' },
            { value: 'arrendador', label: 'Arrendador' },
          ]},
        ],
      },
      SECCION_INMUEBLE_COMPRAVENTA,
      {
        id: 'honorarios',
        titulo: 'Honorarios de la agencia',
        campos: [
          { id: 'importe_honorarios', label: 'Importe honorarios', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'porcentaje_honorarios', label: 'Porcentaje sobre precio', tipo: 'percentage', obligatorio: false, ancho: 'half', sufijo: '%' },
          { id: 'iva_incluido', label: '¿IVA incluido?', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'si', label: 'Sí, IVA incluido' },
            { value: 'no', label: 'No, IVA aparte (21%)' },
          ]},
          { id: 'momento_pago', label: 'Momento de pago', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'firma_arras', label: 'En firma de arras' },
            { value: 'firma_escritura', label: 'En firma de escritura' },
            { value: 'otro', label: 'Otro (especificar)' },
          ]},
          { id: 'detalle_pago', label: 'Detalle del pago', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 14. CONTRATO DE ARRENDAMIENTO
  {
    tipo: 'contrato_arrendamiento',
    subtipo: 'contrato_arrendamiento',
    titulo: 'Contrato de Arrendamiento',
    descripcion: 'Contrato de arrendamiento de inmueble (LAU)',
    secciones: [
      SECCION_ARRENDADOR,
      SECCION_ARRENDATARIO,
      SECCION_INMUEBLE_ALQUILER,
      {
        id: 'condiciones_arrendamiento',
        titulo: 'Condiciones del arrendamiento',
        campos: [
          { id: 'fecha_inicio', label: 'Fecha de inicio del contrato', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'duracion', label: 'Duración inicial', tipo: 'text', obligatorio: true, ancho: 'half', placeholder: 'Ej: 1 año, 5 años...' },
          { id: 'renta_mensual', label: 'Renta mensual', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'dia_pago', label: 'Día de pago mensual', tipo: 'number', obligatorio: true, ancho: 'half', placeholder: 'Ej: 1, 5, 10...' },
          { id: 'forma_pago', label: 'Forma de pago', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'transferencia', label: 'Transferencia bancaria' },
            { value: 'domiciliacion', label: 'Domiciliación bancaria' },
            { value: 'efectivo', label: 'Efectivo' },
          ]},
          { id: 'iban_pago', label: 'IBAN para el pago', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'fianza_mensualidades', label: 'Fianza (nº mensualidades)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fianza_importe', label: 'Importe fianza', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'garantia_adicional', label: 'Garantía adicional', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€', ayuda: 'Aval bancario, seguro de impago, etc.' },
          { id: 'actualizacion_renta', label: 'Actualización de renta', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'ipc', label: 'Según IPC' },
            { value: 'indice_garantia', label: 'Índice de garantía competitividad' },
            { value: 'porcentaje_fijo', label: 'Porcentaje fijo' },
            { value: 'no_actualizacion', label: 'Sin actualización' },
          ]},
          { id: 'suministros', label: 'Suministros a cargo del inquilino', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Agua, luz, gas, comunidad...' },
          { id: 'obras_permitidas', label: 'Obras y mejoras', tipo: 'textarea', obligatorio: false, ancho: 'full' },
          { id: 'mascotas', label: '¿Se permiten mascotas?', tipo: 'select', obligatorio: false, ancho: 'half', opciones: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
            { value: 'previa_autorizacion', label: 'Previa autorización' },
          ]},
          { id: 'clausulas_adicionales', label: 'Cláusulas adicionales', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },

  // 15. CONTRATO DE ARRENDAMIENTO — RESCISIÓN
  {
    tipo: 'contrato_arrendamiento',
    subtipo: 'contrato_arrendamiento_rescision',
    titulo: 'Rescisión de Contrato de Arrendamiento',
    descripcion: 'Documento de rescisión / resolución anticipada del contrato de alquiler',
    secciones: [
      SECCION_ARRENDADOR,
      SECCION_ARRENDATARIO,
      SECCION_INMUEBLE_ALQUILER,
      {
        id: 'datos_contrato_original',
        titulo: 'Datos del contrato a rescindir',
        campos: [
          { id: 'fecha_contrato_original', label: 'Fecha del contrato original', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'fecha_fin_prevista', label: 'Fecha de fin prevista en contrato', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'renta_mensual_vigente', label: 'Renta mensual vigente', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
        ],
      },
      {
        id: 'condiciones_rescision',
        titulo: 'Condiciones de la rescisión',
        campos: [
          { id: 'fecha_rescision', label: 'Fecha efectiva de rescisión', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'motivo_rescision', label: 'Motivo de la rescisión', tipo: 'select', obligatorio: true, ancho: 'half', opciones: [
            { value: 'acuerdo_mutuo', label: 'Acuerdo mutuo' },
            { value: 'voluntad_arrendatario', label: 'Voluntad del arrendatario' },
            { value: 'incumplimiento', label: 'Incumplimiento contractual' },
            { value: 'otro', label: 'Otro' },
          ]},
          { id: 'fianza_devolucion', label: 'Fianza a devolver', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'descuentos_fianza', label: 'Descuentos sobre fianza', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€', ayuda: 'Daños, impagos, gastos...' },
          { id: 'penalizacion_rescision', label: 'Penalización por rescisión anticipada', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'estado_inmueble', label: 'Estado del inmueble en entrega', tipo: 'textarea', obligatorio: true, ancho: 'full' },
          { id: 'lectura_contadores', label: 'Lectura de contadores', tipo: 'textarea', obligatorio: false, ancho: 'full', ayuda: 'Agua, luz, gas — lecturas en fecha de rescisión' },
          { id: 'acuerdos_adicionales', label: 'Acuerdos adicionales', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      SECCION_AGENCIA,
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────

export function getDefinicionDocumento(subtipo: string): DefinicionDocumento | undefined {
  return SCHEMA_DOCUMENTOS.find(d => d.subtipo === subtipo)
}

export const GRUPOS_DOCUMENTOS: GrupoTipoDocumento[] = [
  {
    tipo: 'nota_encargo',
    label: 'Nota de encargo',
    descripcion: 'Encargos de venta o alquiler a la agencia',
    icono: 'FileSignature',
    subtipos: [
      { subtipo: 'nota_encargo_exclusiva', label: 'En exclusiva' },
      { subtipo: 'nota_encargo_sin_exclusiva', label: 'Sin exclusiva' },
    ],
  },
  {
    tipo: 'documento_conformidad',
    label: 'Conformidad de arras',
    descripcion: 'Documentos de conformidad precontractuales',
    icono: 'HandshakeIcon',
    subtipos: [
      { subtipo: 'conformidad_arras_confirmatorias', label: 'Arras confirmatorias' },
      { subtipo: 'conformidad_arras_penitenciales', label: 'Arras penitenciales' },
    ],
  },
  {
    tipo: 'documento_senal',
    label: 'Documento de señal',
    descripcion: 'Reservas y entregas de señal',
    icono: 'CreditCard',
    subtipos: [
      { subtipo: 'senal_arrendamiento', label: 'Señal arrendamiento' },
      { subtipo: 'senal_compraventa_confirmatoria', label: 'Compraventa confirmatoria' },
      { subtipo: 'senal_compraventa_confirmatoria_banco', label: 'Compraventa confirmatoria — banco' },
      { subtipo: 'senal_compraventa_penitencial_banco', label: 'Compraventa penitencial — banco' },
      { subtipo: 'senal_compraventa_penitencial', label: 'Compraventa penitencial' },
      { subtipo: 'senal_oferta', label: 'Oferta de compra' },
    ],
  },
  {
    tipo: 'contrato_arras',
    label: 'Contrato de arras',
    descripcion: 'Contratos de arras penitenciales y confirmatorias',
    icono: 'ScrollText',
    subtipos: [
      { subtipo: 'contrato_arras_penitencial', label: 'Arras penitenciales' },
      { subtipo: 'contrato_arras_confirmatoria', label: 'Arras confirmatorias' },
    ],
  },
  {
    tipo: 'reconocimiento_honorarios',
    label: 'Reconocimiento de honorarios',
    descripcion: 'Aceptación de honorarios de la agencia',
    icono: 'Receipt',
    subtipos: [
      { subtipo: 'reconocimiento_honorarios', label: 'Reconocimiento de honorarios' },
    ],
  },
  {
    tipo: 'contrato_arrendamiento',
    label: 'Contrato de arrendamiento',
    descripcion: 'Contratos de alquiler y rescisiones',
    icono: 'Building2',
    subtipos: [
      { subtipo: 'contrato_arrendamiento', label: 'Contrato de arrendamiento' },
      { subtipo: 'contrato_arrendamiento_rescision', label: 'Rescisión de contrato' },
    ],
  },
]
