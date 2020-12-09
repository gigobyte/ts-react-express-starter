import { ErrorPage } from './pages/ErrorPage'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { RouteConfig } from 'react-router-config'
import { Register } from './pages/Register'

export const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/error',
    exact: true,
    component: ErrorPage
  },
  {
    path: '/login',
    exact: true,
    component: Login
  },
  {
    path: '/register',
    exact: true,
    component: Register
  }
]

export const hiddenAfterLoginRoutes = ['/login']
