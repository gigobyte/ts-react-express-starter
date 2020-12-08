import axios from 'axios'
import { useState } from 'react'
import { useMutation } from 'react-query'

const login = (data: { username: string; password: string }) =>
  axios.post(process.env.API_ROOT + '/login', data)

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [attemptLogin] = useMutation(login)

  return (
    <div>
      Login
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
      <button onClick={() => attemptLogin({ username, password })}>
        Submit
      </button>
    </div>
  )
}
