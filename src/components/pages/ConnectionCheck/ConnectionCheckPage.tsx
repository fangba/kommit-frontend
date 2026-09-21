import ConnectionCheckButton from '@/components/pages/ConnectionCheck/ConnectionCheckButton'
import { fetchDbHealth, fetchHealth } from '@/lib/api/health'

function ConnectionCheckPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ConnectionCheckButton label="Vérifier la connexion au serveur" onCheck={fetchHealth} />
      <ConnectionCheckButton
        label="Vérifier la connexion à la base de données"
        onCheck={fetchDbHealth}
      />
    </main>
  )
}

export default ConnectionCheckPage
