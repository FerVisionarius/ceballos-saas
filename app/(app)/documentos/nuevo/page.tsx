import { DocumentoWizard } from '@/components/documentos/DocumentoWizard'

export default function NuevoDocumentoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Nuevo documento</h1>
        <p className="text-slate-500 mt-1">Selecciona el tipo de documento y rellena los datos</p>
      </div>
      <DocumentoWizard />
    </div>
  )
}
