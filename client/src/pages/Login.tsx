import { useState } from 'react'
import { useMutation } from 'react-query'
import { ApiError, request } from '../http'
import { useSession } from '../session'

const login = (data: { username: string; password: string }) =>
  request<{ accessToken: string }>({ method: 'POST', url: '/login', data })

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>()
  const { login: processLogin } = useSession()

  const { mutateAsync: loginMutation } = useMutation(login, {
    onSuccess: res => processLogin(res.data.accessToken),
    onError: (err: ApiError) => setError(err.response.data.code)
  })

  return (
    <div>
      <div>Login</div>
      <input
        className="border-2 border-black"
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      ></input>
      <input
        className="border-2 border-black"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      ></input>
      <br />
      {error && JSON.stringify(error)}
      <button onClick={() => loginMutation({ username, password })}>
        Submit
      </button>
    </div>
  )
}
