import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ConnectionCheckPage from '@/components/pages/ConnectionCheck/ConnectionCheckPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionCheckPage />
    </QueryClientProvider>
  )
}

export default App
