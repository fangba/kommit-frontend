import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Status = 'idle' | 'checking' | 'ok' | 'error'

type ConnectionCheckButtonProps = {
  label: string
  onCheck: () => Promise<void>
}

function ConnectionCheckButton({ label, onCheck }: ConnectionCheckButtonProps) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleClick() {
    setStatus('checking')
    try {
      await onCheck()
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleClick} disabled={status === 'checking'}>
        {label}
      </Button>
      {status === 'ok' && <CheckCircle2 className="size-4 text-emerald-600" />}
      {status === 'error' && <XCircle className="size-4 text-destructive" />}
    </div>
  )
}

export default ConnectionCheckButton
