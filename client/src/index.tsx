import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import 'tailwindcss/tailwind.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('main')
)

if (process.env.NODE_ENV === 'production') {
  window.onerror = () => window.location.assign('/error')
}
