import { useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router'
import { ApiError, request } from '../http'

const register = (data: {
  username: string
  password: string
  email: string
}) => request({ method: 'POST', url: '/register', data })

export const Register = () => {
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync: registerMutation } = useMutation(register, {
    onSuccess: () => history.push('/login'),
    onError: (err: ApiError) => setError(err.response.data.code)
  })

  return (
    <div>
      <div>Register</div>
      <input
        className="border-2 border-black"
        value={username}
        placeholder="username"
        onChange={e => setUsername(e.target.value)}
      ></input>
      <input
        className="border-2 border-black"
        value={password}
        placeholder="password"
        onChange={e => setPassword(e.target.value)}
      ></input>
      <input
        className="border-2 border-black"
        value={email}
        placeholder="email"
        onChange={e => setEmail(e.target.value)}
      ></input>
      <br />
      {error}
      <button onClick={() => registerMutation({ username, password, email })}>
        Submit
      </button>
    </div>
  )
}
