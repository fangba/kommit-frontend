import { useMutation } from '@tanstack/react-query'
import { CircleCheckIcon, CircleXIcon, Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ConnectionCheckButtonProps = {
  label: string
  onCheck: () => Promise<unknown>
}

function ConnectionCheckButton({ label, onCheck }: ConnectionCheckButtonProps) {
  const { mutate, isPending, isSuccess, isError } = useMutation({ mutationFn: onCheck })

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => mutate()} disabled={isPending}>
        {label}
      </Button>
      {isPending && <Loader2Icon className="size-4 animate-spin text-muted-foreground" />}
      {isSuccess && <CircleCheckIcon className="size-4 text-emerald-600" />}
      {isError && <CircleXIcon className="size-4 text-destructive" />}
    </div>
  )
}

export default ConnectionCheckButton
