import axios from 'axios'
import { useState } from 'react'
import { useMutation } from 'react-query'

const register = (data: {
  username: string
  password: string
  email: string
}) => axios.post(process.env.API_ROOT + '/register', data)

export const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [attemptRegister] = useMutation(register)

  return (
    <div>
      Register
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
      <button onClick={() => attemptRegister({ username, password, email })}>
        Submit
      </button>
    </div>
  )
}
