import { createContext, useContext } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useMutation, useQuery } from 'react-query'
import { request } from './http'
import { hiddenAfterLoginRoutes } from './routes'

let accessToken = ''
export const setAccessToken = (token: string) => (accessToken = token)
export const getAccessToken = () => accessToken

interface Session {
  user?: User
  login: (accessToken: string) => void
  logout: () => void
}

interface User {
  username: string
  createdOn: string
}

const SessionContext = createContext<Session>(null!)

const fetchUser = async () => {
  const refreshTokenResponse = await request<{ accessToken: string }>({
    method: 'POST',
    url: '/refresh-token'
  })

  setAccessToken(refreshTokenResponse.data.accessToken)

  return request<User>({ url: '/me' }).then(res => res.data)
}

const logout = () => request<void>({ method: 'POST', url: '/logout' })

export const SessionProvider: React.FC = ({ children }) => {
  const history = useHistory()
  const location = useLocation()

  const { mutateAsync: logoutMutation } = useMutation(logout)

  const user = useQuery('user', fetchUser, {
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      if (hiddenAfterLoginRoutes.includes(location.pathname)) {
        history.push('/')
      }
    }
  })

  if (user.isFetching) {
    return null
  }

  return (
    <SessionContext.Provider
      value={{
        user: user.data,
        async login(accessToken) {
          setAccessToken(accessToken)
          await user.refetch()
          history.push('/')
        },
        async logout() {
          await logoutMutation()
          setAccessToken('')
          user.refetch()
          history.push('/')
        }
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const session = useContext(SessionContext)

  return session
}
