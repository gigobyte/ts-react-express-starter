import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import { SessionProvider } from './session'
import './styles.css'

export const App = () => (
  <BrowserRouter>
    <SessionProvider>{renderRoutes(routes)}</SessionProvider>
  </BrowserRouter>
)
