import ConnectionCheckButton from '@/components/pages/Diagnostic/ConnectionCheckButton'
import { checkServerHealth, checkDbHealth } from '@/lib/api/health'

function DiagnosticPage() {
  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <ConnectionCheckButton
        label="Vérifier la connexion au serveur"
        onCheck={checkServerHealth}
      />
      <ConnectionCheckButton
        label="Vérifier la connexion à la base de données"
        onCheck={checkDbHealth}
      />
    </div>
  )
}

export default DiagnosticPage
