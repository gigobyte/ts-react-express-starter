import React, { useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router'
import { useQuery } from 'react-query'

interface Session {
  user: User
}

interface User {
  username: string
  createdOn: string
}

const SessionContext = React.createContext<Session | null>(null)

const fetchUser = () =>
  axios.get<User>(process.env.API_ROOT + '/me').then(res => res.data)

export const SessionProvider: React.FC = ({ children }) => {
  const history = useHistory()
  const location = useLocation()
  const user = useQuery('user', fetchUser, { retry: false })

  useEffect(() => {
    if (user.isError && location.pathname !== '/register') {
      history.push('/login')
    }
  }, [user])

  if (!user.isFetched) {
    return null
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <SessionContext.Provider value={{ user: user.data! }}>
      {children}
    </SessionContext.Provider>
  )
}
