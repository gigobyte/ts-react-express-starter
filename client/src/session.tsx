import { createContext, useContext } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useQuery } from 'react-query'
import { request } from './http'
import { publicRoutes } from './routes'

let accessToken = ''
export const setAccessToken = (token: string) => (accessToken = token)
export const getAccessToken = () => accessToken

interface Session {
  user?: User
}

interface User {
  username: string
  createdOn: string
}

const SessionContext = createContext<Session | null>(null)

const fetchUser = async () => {
  const refreshTokenResponse = await request<{ accessToken: string }>({
    method: 'POST',
    url: '/refresh-token'
  })

  setAccessToken(refreshTokenResponse.data.accessToken)

  return request<User>({ url: '/me' }).then(res => res.data)
}

export const SessionProvider: React.FC = ({ children }) => {
  const history = useHistory()
  const location = useLocation()

  const user = useQuery('user', fetchUser, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: 6000,
    onError: () => {
      if (!publicRoutes.includes(location.pathname)) {
        history.push('/login')
      }
    }
  })

  if (user.isFetching) {
    return null
  }

  return (
    <SessionContext.Provider value={{ user: user.data }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useUser = () => {
  const session = useContext(SessionContext)

  return session?.user
}
