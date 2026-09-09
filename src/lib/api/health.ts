const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function checkServerHealth() {
  const response = await fetch(`${API_URL}/health`)
  if (!response.ok) {
    throw new Error('Serveur indisponible')
  }
}

export async function checkDbHealth() {
  const response = await fetch(`${API_URL}/db-health`)
  if (!response.ok) {
    throw new Error('Base de données indisponible')
  }
}
