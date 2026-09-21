import type { DbHealthStatus, HealthStatus } from '@/types/apiContract'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function fetchHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/health`)
  if (!response.ok) throw new Error('Le serveur ne répond pas correctement')
  return response.json()
}

export async function fetchDbHealth(): Promise<DbHealthStatus> {
  const response = await fetch(`${API_BASE_URL}/db-health`)
  if (!response.ok) throw new Error('La base de données ne répond pas correctement')
  return response.json()
}
