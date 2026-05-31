import type {
  DefinicionDocumento,
  GrupoTipoDocumento,
  SeccionFormulario,
} from '@/types'

const SECCION_AGENCIA: SeccionFormulario = {
  id: 'agencia',
  titulo: 'Datos de la agencia',
  campos: [
    { id: 'agencia_nombre', label: 'Nombre agencia', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'agencia_cif', label: 'CIF', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'agencia_agente', label: 'Nombre del agente', tipo: 'text', obligatorio: true, ancho: 'half' },
    { id: 'agencia_telefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
  ],
}

export const SCHEMA_DOCUMENTOS: DefinicionDocumento[] = [

  // 1. NotaEncargoExclusiva
  {
    tipo: 'nota_encargo',
    subtipo: 'nota_encargo_exclusiva',
    titulo: 'NotaEncargoExclusiva',
    descripcion: 'Nota de encargo en exclusiva',
    secciones: [
      {
        id: 'vendedor',
        titulo: 'Datos del cliente / propietario',
        campos: [
          { id: 'nombrecliente', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'mailcliente', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrolugar', label: 'Registro — Lugar', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrotomo', label: 'Tomo', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrolibro', label: 'Libro', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrofolio', label: 'Folio', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrofinca', label: 'Finca', tipo: 'text', obligatorio: false, ancho: 'third' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones del encargo',
        campos: [
          { id: 'precioventaletra', label: 'Precio de venta (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio de venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'hipotecapendiente', label: 'Hipoteca pendiente (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'tiempomeses', label: 'Plazo del encargo (meses)', tipo: 'number', obligatorio: true, ancho: 'third' },
          { id: 'comisionporcentaje', label: 'Comisión (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
          { id: 'minimonumero', label: 'Mínimo honorarios (€)', tipo: 'currency', obligatorio: true, ancho: 'third', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'third' },
        ],
      },
    ],
  },

  // 2. NotaEncargoSinExclusiva
  {
    tipo: 'nota_encargo',
    subtipo: 'nota_encargo_sin_exclusiva',
    titulo: 'NotaEncargoSinExclusiva',
    descripcion: 'Nota de encargo sin exclusiva',
    secciones: [
      {
        id: 'vendedor',
        titulo: 'Datos del cliente / propietario',
        campos: [
          { id: 'nombrecliente', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'mailcliente', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones del encargo',
        campos: [
          { id: 'precioventaletra', label: 'Precio de venta (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio de venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'hipotecapendiente', label: 'Hipoteca pendiente (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'tiempomeses', label: 'Plazo del encargo (meses)', tipo: 'number', obligatorio: true, ancho: 'third' },
          { id: 'comisionporcentaje', label: 'Comisión (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
          { id: 'minimoletra', label: 'Mínimo honorarios (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'minimonumero', label: 'Mínimo honorarios (€)', tipo: 'currency', obligatorio: true, ancho: 'third', prefijo: '€' },
          { id: 'observacionesmuebles', label: 'Observaciones', tipo: 'textarea', obligatorio: false, ancho: 'full' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 3. DocumentoConformidadArrasConfimatorias
  {
    tipo: 'documento_conformidad',
    subtipo: 'conformidad_arras_confirmatorias',
    titulo: 'DocumentoConformidadArrasConfimatorias',
    descripcion: 'Documento de conformidad de arras confirmatorias',
    secciones: [
      {
        id: 'cliente',
        titulo: 'Datos del cliente',
        campos: [
          { id: 'nombrecliente', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioventaletra', label: 'Precio venta (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'precioseñalletra', label: 'Precio señal (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioseñalnumero', label: 'Precio señal (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazofirmacontrato', label: 'Plazo firma contrato', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioarrasletra', label: 'Precio arras (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioarrasnumero', label: 'Precio arras (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazomaximodias', label: 'Plazo máximo (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'comisionporcentaje', label: 'Comisión (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
          { id: 'comisionimporteletra', label: 'Comisión (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'comisionimportenumero', label: 'Comisión (€)', tipo: 'currency', obligatorio: true, ancho: 'third', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 4. DocumentoConformidadArrasPenitenciales
  {
    tipo: 'documento_conformidad',
    subtipo: 'conformidad_arras_penitenciales',
    titulo: 'DocumentoConformidadArrasPenitenciales',
    descripcion: 'Documento de conformidad de arras penitenciales',
    secciones: [
      {
        id: 'cliente',
        titulo: 'Datos del cliente',
        campos: [
          { id: 'nombrecliente', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioventaletra', label: 'Precio venta (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'precioseñalletra', label: 'Precio señal (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioseñalnumero', label: 'Precio señal (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazomaximodias', label: 'Plazo máximo (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'precioarrasletra', label: 'Precio arras (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioarrasnumero', label: 'Precio arras (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazofirmacontrato', label: 'Plazo firma contrato (días hábiles)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'comisionporcentaje', label: 'Comisión (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
          { id: 'comisionimporteletra', label: 'Comisión (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'comisionimportenumero', label: 'Comisión (€)', tipo: 'currency', obligatorio: true, ancho: 'third', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 5. DocumentoSeñalArrendamiento
  {
    tipo: 'documento_senal',
    subtipo: 'senal_arrendamiento',
    titulo: 'DocumentoSeñalArrendamiento',
    descripcion: 'Documento de señal para arrendamiento',
    secciones: [
      {
        id: 'cliente',
        titulo: 'Datos del cliente',
        campos: [
          { id: 'nombrecliente', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocallecliente', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones del arrendamiento',
        campos: [
          { id: 'precioseñalletra', label: 'Precio señal (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'fechaarrendamiento', label: 'Fecha inicio arrendamiento', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'duracionarrendamiento', label: 'Duración arrendamiento', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'rentaarrendamiento', label: 'Renta mensual (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha del documento', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 6. DocumentoSeñalCompraventaConfirmatoria
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_confirmatoria',
    titulo: 'DocumentoSeñalCompraventaConfirmatoria',
    descripcion: 'Documento de señal compraventa confirmatoria',
    secciones: [
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecliente', label: 'Nombre comprador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocallecliente', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
        ],
      },
      {
        id: 'propietario',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre propietario', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioseñalletra', label: 'Precio señal (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioseñalnumero', label: 'Precio señal (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'precioventaletra', label: 'Precio venta (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazomaximodias', label: 'Plazo máximo (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 7. DocumentoSeñalCompraventaConfirmatoriaIngresoBanco
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_confirmatoria_banco',
    titulo: 'DocumentoSeñalCompraventaConfirmatoriaIngresoBanco',
    descripcion: 'Señal compraventa confirmatoria con ingreso en banco',
    secciones: [
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecliente', label: 'Nombre comprador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocallecliente', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
        ],
      },
      {
        id: 'propietario',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre propietario', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioseñalletra', label: 'Precio señal (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioseñalnumero', label: 'Precio señal (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'precioventaletra', label: 'Precio venta (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazomaximodias', label: 'Plazo máximo (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 8. DocumentoSeñalCompraventaPenitencialIngresoBanco
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_penitencial_banco',
    titulo: 'DocumentoSeñalCompraventaPenitencialIngresoBanco',
    descripcion: 'Señal compraventa penitencial con ingreso en banco',
    secciones: [
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecliente', label: 'Nombre comprador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocallecliente', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
        ],
      },
      {
        id: 'propietario',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre propietario', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioseñalletra', label: 'Precio señal (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioseñalnumero', label: 'Precio señal (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'precioventaletra', label: 'Precio venta (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazomaximodias', label: 'Plazo máximo (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 9. DocumentoSeñalCompraventaPenitencial
  {
    tipo: 'documento_senal',
    subtipo: 'senal_compraventa_penitencial',
    titulo: 'DocumentoSeñalCompraventaPenitencial',
    descripcion: 'Señal compraventa penitencial',
    secciones: [
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecliente', label: 'Nombre comprador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocallecliente', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
        ],
      },
      {
        id: 'propietario',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre propietario', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioseñalletra', label: 'Precio señal (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioseñalnumero', label: 'Precio señal (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'precioventaletra', label: 'Precio venta (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'plazomaximodias', label: 'Plazo máximo (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 10. DocumentoSeñalOferta
  {
    tipo: 'documento_senal',
    subtipo: 'senal_oferta',
    titulo: 'DocumentoSeñalOferta',
    descripcion: 'Documento de señal y oferta de compra',
    secciones: [
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecliente', label: 'Nombre comprador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocallecliente', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'telefonocliente', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble (MAYÚS)',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio (MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle (MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número (MAYÚS)', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'garajeinmueble', label: 'Nº garaje (MAYÚS)', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'trasteroinmueble', label: 'Nº trastero (MAYÚS)', tipo: 'text', obligatorio: false, ancho: 'third' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioventanumero', label: 'Precio venta (MAYÚS)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'nombrepropietario', label: 'Nombre propietario (MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioofertanumero', label: 'Precio oferta (MAYÚS)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'depositooferta', label: 'Depósito de oferta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 11. ContratoArrasPenitancial
  {
    tipo: 'contrato_arras',
    subtipo: 'contrato_arras_penitencial',
    titulo: 'ContratoArrasPenitancial',
    descripcion: 'Contrato de arras penitencial',
    secciones: [
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecomprador', label: 'Nombre comprador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecomprador', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnicomprador', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'vendedor',
        titulo: 'Datos del vendedor',
        campos: [
          { id: 'nombrevendedor', label: 'Nombre vendedor', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callevendedor', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnivendedor', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registronumero', label: 'Nº registro', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrolugar', label: 'Registro — Lugar', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrotomo', label: 'Tomo', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrolibro', label: 'Libro', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrofolio', label: 'Folio', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrofinca', label: 'Finca', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'fincaurbana', label: 'Finca urbana (descripción)', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioventaletra', label: 'Precio venta (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'cuentabancovendedor', label: 'Cuenta banco vendedor', tipo: 'text', obligatorio: true, ancho: 'full' },
          { id: 'cantidadrestanteletra', label: 'Cantidad restante (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadrestantenumero', label: 'Cantidad restante (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'cantidadretenidaletra', label: 'Cantidad retenida (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadretenidanumero', label: 'Cantidad retenida (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechalimite', label: 'Fecha límite', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'cantidadindemnizaciónletra', label: 'Indemnización (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadindemnizaciónnumero', label: 'Indemnización (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 12. ContratoArrasConfirmatoria
  {
    tipo: 'contrato_arras',
    subtipo: 'contrato_arras_confirmatoria',
    titulo: 'ContratoArrasConfirmatoria',
    descripcion: 'Contrato de arras confirmatoria',
    secciones: [
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecomprador', label: 'Nombre comprador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecomprador', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnicomprador', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'vendedor',
        titulo: 'Datos del vendedor',
        campos: [
          { id: 'nombrevendedor', label: 'Nombre vendedor', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callevendedor', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnivendedor', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registronumero', label: 'Nº registro', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrolugar', label: 'Registro — Lugar', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrotomo', label: 'Tomo', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrolibro', label: 'Libro', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrofolio', label: 'Folio', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'registrofinca', label: 'Finca', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'fincaurbana', label: 'Finca urbana (descripción)', tipo: 'textarea', obligatorio: false, ancho: 'full' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'precioventaletra', label: 'Precio venta (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'precioventanumero', label: 'Precio venta (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'entregaporbancoletra', label: 'Entrega por banco (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'entregaporbanconumero', label: 'Entrega por banco (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'cuentabancovendedor', label: 'Cuenta banco vendedor', tipo: 'text', obligatorio: true, ancho: 'full' },
          { id: 'cantidadrestanteletra', label: 'Cantidad restante (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadrestantenumero', label: 'Cantidad restante (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'cantidadretenidaletra', label: 'Cantidad retenida (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadretenidanumero', label: 'Cantidad retenida (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechalimite', label: 'Fecha límite', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'cantidadindemnizaciónletra', label: 'Indemnización (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadindemnizaciónnumero', label: 'Indemnización (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 13. ReconocimientoHonorarios
  {
    tipo: 'reconocimiento_honorarios',
    subtipo: 'reconocimiento_honorarios',
    titulo: 'ReconocimientoHonorarios',
    descripcion: 'Reconocimiento de honorarios',
    secciones: [
      {
        id: 'cliente',
        titulo: 'Datos del cliente',
        campos: [
          { id: 'nombrecliente', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipiocliente', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecliente', label: 'Calle', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocallecliente', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'dnicliente', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'honorarios',
        titulo: 'Honorarios',
        campos: [
          { id: 'fechalimite', label: 'Plazo (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'honorariosletra', label: 'Honorarios (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'honorariosnumero', label: 'Honorarios (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'señalconfirmatorialetra', label: 'Señal confirmatoria (en letra)', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'señalconfirmatorianumero', label: 'Señal confirmatoria (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 14. ContratoArrendamiento
  {
    tipo: 'contrato_arrendamiento',
    subtipo: 'contrato_arrendamiento',
    titulo: 'ContratoArrendamiento',
    descripcion: 'Contrato de arrendamiento',
    secciones: [
      {
        id: 'arrendador',
        titulo: 'Datos del arrendador',
        campos: [
          { id: 'nombrearrendador', label: 'Nombre arrendador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipioarrendador', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callearrendador', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniarrendador', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'mailarrendador', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
          { id: 'telefonoarrendador', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'arrendatario',
        titulo: 'Datos del arrendatario',
        campos: [
          { id: 'nombrearrendatario', label: 'Nombre arrendatario', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipioarrendatario', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callearrendatario', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniarrendatario', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'mailarrendatario', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
          { id: 'telefonoarrendatario', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'pisoletrainmueble', label: 'Piso / Letra', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'referenciacatastralinmueble', label: 'Referencia catastral', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'certificadoeficienciaenergetica', label: 'Certificado eficiencia energética', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones del arrendamiento',
        campos: [
          { id: 'fechainicioalquiler', label: 'Fecha inicio alquiler', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'importerentainicial', label: 'Importe renta inicial (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'cuentabancoarrendador', label: 'Cuenta banco arrendador', tipo: 'text', obligatorio: true, ancho: 'full' },
          { id: 'garantiaadicionalletra', label: 'Garantía adicional (en letra)', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'garantiaadicionalnumero', label: 'Garantía adicional (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'cantidadfianzaletra', label: 'Fianza (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadfianzanumero', label: 'Fianza (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 15. ContratoArrendamientoRescisión
  {
    tipo: 'contrato_arrendamiento',
    subtipo: 'contrato_arrendamiento_rescision',
    titulo: 'ContratoArrendamientoRescisión',
    descripcion: 'Rescisión de contrato de arrendamiento',
    secciones: [
      {
        id: 'arrendador',
        titulo: 'Datos del arrendador',
        campos: [
          { id: 'nombrearrendador', label: 'Nombre arrendador', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'municipioarrendador', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callearrendador', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniarrendador', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'arrendatario',
        titulo: 'Datos del arrendatario',
        campos: [
          { id: 'nombrearrendatario', label: 'Nombre arrendatario', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniarrendatario', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipioarrendatario', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callearrendatario', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'pisoletrainmueble', label: 'Piso / Letra', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'fechainicioalquiler', label: 'Fecha inicio alquiler', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numeroinmueble', label: 'Número', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'garajeinmueble', label: 'Nº garaje', tipo: 'text', obligatorio: false, ancho: 'third' },
          { id: 'trasteroinmueble', label: 'Nº trastero', tipo: 'text', obligatorio: false, ancho: 'third' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones de la rescisión',
        campos: [
          { id: 'fechafirmacontratoalquiler', label: 'Fecha firma contrato alquiler', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'fechafincontratoalquiler', label: 'Fecha fin contrato alquiler', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'cantidadfianzaletra', label: 'Fianza (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'cantidadfianzanumero', label: 'Fianza (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 16. ContratoArrasCompraVentaPagoAplazado
  {
    tipo: 'contrato_arras',
    subtipo: 'contrato_arras_compraventa_pago_aplazado',
    titulo: 'ContratoArrasCompraVentaPagoAplazado',
    descripcion: 'Contrato de arras compraventa con pago aplazado',
    secciones: [
      {
        id: 'arrendador',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnipropietario', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiopropietario', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callepropietario', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'propietariotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'propietariomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'arrendatario',
        titulo: 'Datos del inquilino / comprador',
        campos: [
          { id: 'nombreinquilino', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniinquilino', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipioinquilino', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinquilino', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'inquilinotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'inquilinomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle, número y piso completo', tipo: 'text', obligatorio: true, ancho: 'full' },
        ],
      },
      {
        id: 'condiciones_arrendamiento',
        titulo: 'Condiciones del arrendamiento',
        campos: [
          { id: 'fechacontratovigor', label: 'Fecha entrada en vigor', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'duracioncontrato', label: 'Duración del contrato (años)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'alargarmesescontrato', label: 'Prórroga (meses)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'comoseentregainmueble', label: 'Estado de entrega del inmueble', tipo: 'textarea', obligatorio: true, ancho: 'full' },
          { id: 'rentaanualletra', label: 'Renta anual (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'rentaanualnumero', label: 'Renta anual (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'rentamensualletra', label: 'Renta mensual (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'rentamensualnumero', label: 'Renta mensual (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'porcentajeprimeraño', label: 'Actualización 1er año (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
          { id: 'porcentajesegundoaño', label: 'Actualización 2º año (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
          { id: 'porcentajeterceraño', label: 'Actualización 3er año (%)', tipo: 'percentage', obligatorio: true, ancho: 'third', sufijo: '%' },
        ],
      },
      {
        id: 'garantias',
        titulo: 'Garantías',
        campos: [
          { id: 'primaletra', label: 'Prima (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'primanumero', label: 'Prima (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importegarantialetra', label: 'Importe garantía (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'importegarantianumero', label: 'Importe garantía (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
        ],
      },
      {
        id: 'compraventa',
        titulo: 'Condiciones de compraventa',
        campos: [
          { id: 'plazocompraaños', label: 'Plazo para compra (años)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'preciocompraventaletra', label: 'Precio compraventa (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'preciocompraventanumero', label: 'Precio compraventa (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
        ],
      },
      {
        id: 'cuenta_propietario',
        titulo: 'Cuenta bancaria del propietario',
        campos: [
          { id: 'titularcuentapropietario', label: 'Titular de la cuenta', tipo: 'text', obligatorio: true, ancho: 'third' },
          { id: 'entidadcuentapropietario', label: 'Entidad bancaria', tipo: 'text', obligatorio: true, ancho: 'third' },
          { id: 'numerocuentapropietario', label: 'Número de cuenta (IBAN)', tipo: 'text', obligatorio: true, ancho: 'third' },
        ],
      },
      {
        id: 'condiciones_fecha',
        titulo: 'Fecha del documento',
        campos: [
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 17. ContratoArrasPromesaCompraVentaVPO
  {
    tipo: 'contrato_arras',
    subtipo: 'contrato_arras_promesa_compraventa_vpo',
    titulo: 'ContratoArrasPromesaCompraVentaVPO',
    descripcion: 'Contrato de arras promesa de compraventa VPO',
    secciones: [
      {
        id: 'vendedor',
        titulo: 'Datos del vendedor',
        campos: [
          { id: 'nombrevendedor', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnivendedor', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiovendedor', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callevendedor', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'telefonovendedor', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'mailvendedor', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'comprador',
        titulo: 'Datos del comprador',
        campos: [
          { id: 'nombrecomprador', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnicomprador', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiocomprador', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callecomprador', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'telefonocomprador', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'mailcomprador', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle, número y piso completo', tipo: 'text', obligatorio: true, ancho: 'full' },
          { id: 'garajeinmueble', label: 'Garaje (nº o anejo)', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'trasteroinmueble', label: 'Trastero (nº o anejo)', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'superficieconstruida', label: 'Superficie construida (m²)', tipo: 'number', obligatorio: true, ancho: 'third' },
          { id: 'superficieutil', label: 'Superficie útil (m²)', tipo: 'number', obligatorio: true, ancho: 'third' },
          { id: 'superficiegarajetrastero', label: 'Superficie garaje/trastero (m²)', tipo: 'number', obligatorio: false, ancho: 'third' },
          { id: 'numeroexpedientevpo', label: 'Nº expediente VPO', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'delegacionconsejeria', label: 'Delegación / Consejería', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones económicas',
        campos: [
          { id: 'preciototalcompraventaletra', label: 'Precio total compraventa (en letra, MAYÚS)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'preciototalcompraventanumero', label: 'Precio total compraventa (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'formapago', label: 'Forma de pago', tipo: 'textarea', obligatorio: true, ancho: 'full' },
          { id: 'fechadocumentoconformidad', label: 'Fecha documento de conformidad', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'plazodiasescritura', label: 'Plazo para escritura (días)', tipo: 'number', obligatorio: true, ancho: 'half' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 18. ContratoArrendamientoAval
  {
    tipo: 'contrato_arrendamiento',
    subtipo: 'contrato_arrendamiento_aval',
    titulo: 'ContratoArrendamientoAval',
    descripcion: 'Contrato de arrendamiento con aval',
    secciones: [
      {
        id: 'arrendador',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnipropietario', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiopropietario', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callepropietario', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'propietariotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'propietariomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'arrendatario',
        titulo: 'Datos del inquilino',
        campos: [
          { id: 'nombreinquilino', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniinquilino', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipioinquilino', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinquilino', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'inquilinotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'inquilinomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'avalista',
        titulo: 'Datos del avalista',
        campos: [
          { id: 'nombreavalista', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniavalista', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipioavalista', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleavalista', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle, número y piso completo', tipo: 'text', obligatorio: true, ancho: 'full' },
          { id: 'referenciacatastralinmueble', label: 'Referencia catastral', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'certificadoeficienciaenergetica', label: 'Certificado eficiencia energética', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones del arrendamiento',
        campos: [
          { id: 'fechacontratovigor', label: 'Fecha entrada en vigor', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'rentamensualletra', label: 'Renta mensual (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garantiaadicionalletra', label: 'Garantía adicional (en letra)', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'garantiaadicionalnumero', label: 'Garantía adicional (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'fianzaletra', label: 'Fianza (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'fianzanumero', label: 'Fianza (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'importeavalletra', label: 'Importe aval (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'importeavalnumero', label: 'Importe aval (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechafinaval', label: 'Fecha fin aval', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'cuenta_propietario',
        titulo: 'Cuenta bancaria del propietario',
        campos: [
          { id: 'titularcuentapropietario', label: 'Titular de la cuenta', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocuentapropietario', label: 'Número de cuenta (IBAN)', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 19. ContratoArrendamientoTrabajadores
  {
    tipo: 'contrato_arrendamiento',
    subtipo: 'contrato_arrendamiento_trabajadores',
    titulo: 'ContratoArrendamientoTrabajadores',
    descripcion: 'Contrato de arrendamiento para trabajadores',
    secciones: [
      {
        id: 'arrendador',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnipropietario', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiopropietario', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callepropietario', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'propietariotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'propietariomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'arrendatario',
        titulo: 'Datos del inquilino',
        campos: [
          { id: 'nombreinquilino', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniinquilino', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipioinquilino', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinquilino', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'inquilinotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'inquilinomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'trabajador',
        titulo: 'Datos del trabajador',
        campos: [
          { id: 'nombretrabajador', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnitrabajador', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle, número y piso completo', tipo: 'text', obligatorio: true, ancho: 'full' },
          { id: 'referenciacatastralinmueble', label: 'Referencia catastral', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'certificadoeficienciaenergetica', label: 'Certificado eficiencia energética', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones del arrendamiento',
        campos: [
          { id: 'fechacontratovigor', label: 'Fecha entrada en vigor', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'rentamensualletra', label: 'Renta mensual (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garantiaadicionalletra', label: 'Garantía adicional (en letra)', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'garantiaadicionalnumero', label: 'Garantía adicional (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'fianzaletra', label: 'Fianza (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'fianzanumero', label: 'Fianza (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'cuenta_propietario',
        titulo: 'Cuenta bancaria del propietario',
        campos: [
          { id: 'titularcuentapropietario', label: 'Titular de la cuenta', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocuentapropietario', label: 'Número de cuenta (IBAN)', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },

  // 20. ContratoArrendamientoVPO
  {
    tipo: 'contrato_arrendamiento',
    subtipo: 'contrato_arrendamiento_vpo',
    titulo: 'ContratoArrendamientoVPO',
    descripcion: 'Contrato de arrendamiento VPO',
    secciones: [
      {
        id: 'arrendador',
        titulo: 'Datos del propietario',
        campos: [
          { id: 'nombrepropietario', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnipropietario', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipiopropietario', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'callepropietario', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'propietariotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'propietariomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'arrendatario',
        titulo: 'Datos del inquilino',
        campos: [
          { id: 'nombreinquilino', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dniinquilino', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
          { id: 'municipioinquilino', label: 'Municipio', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinquilino', label: 'Calle y número', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'inquilinotelefono', label: 'Teléfono', tipo: 'phone', obligatorio: true, ancho: 'half' },
          { id: 'inquilinomail', label: 'Email', tipo: 'email', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'trabajador',
        titulo: 'Datos del trabajador / beneficiario VPO',
        campos: [
          { id: 'nombretrabajador', label: 'Nombre completo', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'dnitrabajador', label: 'DNI / NIE', tipo: 'nif', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'inmueble',
        titulo: 'Datos del inmueble',
        campos: [
          { id: 'municipioinmueble', label: 'Municipio del inmueble', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'calleinmueble', label: 'Calle, número y piso completo', tipo: 'text', obligatorio: true, ancho: 'full' },
          { id: 'referenciacatastralinmueble', label: 'Referencia catastral', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'certificadoeficienciaenergetica', label: 'Certificado eficiencia energética', tipo: 'text', obligatorio: false, ancho: 'half' },
        ],
      },
      {
        id: 'condiciones',
        titulo: 'Condiciones del arrendamiento',
        campos: [
          { id: 'fechacontratovigor', label: 'Fecha entrada en vigor', tipo: 'date', obligatorio: true, ancho: 'half' },
          { id: 'rentamensualletra', label: 'Renta mensual (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'garantiaadicionalletra', label: 'Garantía adicional (en letra)', tipo: 'text', obligatorio: false, ancho: 'half' },
          { id: 'garantiaadicionalnumero', label: 'Garantía adicional (€)', tipo: 'currency', obligatorio: false, ancho: 'half', prefijo: '€' },
          { id: 'fianzaletra', label: 'Fianza (en letra)', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'fianzanumero', label: 'Fianza (€)', tipo: 'currency', obligatorio: true, ancho: 'half', prefijo: '€' },
          { id: 'fechaactual', label: 'Fecha', tipo: 'date', obligatorio: true, ancho: 'half' },
        ],
      },
      {
        id: 'cuenta_propietario',
        titulo: 'Cuenta bancaria del propietario',
        campos: [
          { id: 'titularcuentapropietario', label: 'Titular de la cuenta', tipo: 'text', obligatorio: true, ancho: 'half' },
          { id: 'numerocuentapropietario', label: 'Número de cuenta (IBAN)', tipo: 'text', obligatorio: true, ancho: 'half' },
        ],
      },
    ],
  },
]

export function getDefinicionDocumento(subtipo: string): DefinicionDocumento | undefined {
  return SCHEMA_DOCUMENTOS.find(d => d.subtipo === subtipo)
}

export const GRUPOS_DOCUMENTOS: GrupoTipoDocumento[] = [
  {
    tipo: 'nota_encargo',
    label: 'Nota de encargo',
    descripcion: 'Encargos de venta a la agencia',
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
      { subtipo: 'contrato_arras_compraventa_pago_aplazado', label: 'Compraventa pago aplazado' },
      { subtipo: 'contrato_arras_promesa_compraventa_vpo', label: 'Promesa compraventa VPO' },
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
      { subtipo: 'contrato_arrendamiento_aval', label: 'Arrendamiento con aval' },
      { subtipo: 'contrato_arrendamiento_trabajadores', label: 'Arrendamiento trabajadores' },
      { subtipo: 'contrato_arrendamiento_vpo', label: 'Arrendamiento VPO' },
    ],
  },
]