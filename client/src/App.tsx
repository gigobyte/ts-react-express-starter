import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { routes } from './routes'
import { SessionProvider } from './session'
import './styles.css'

const client = new QueryClient()

export const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={client}>
      <SessionProvider>{renderRoutes(routes)}</SessionProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
