import { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './App'
import 'tailwindcss/tailwind.css'

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('main')
)

if (process.env.NODE_ENV === 'production') {
  window.onerror = () => window.location.assign('/error')
}
