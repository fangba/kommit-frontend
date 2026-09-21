export type HealthStatus = {
  status: 'ok'
  uptime: number
  timestamp: string
}

export type DbHealthStatus = { status: 'ok'; latency: number } | { status: 'error' }
