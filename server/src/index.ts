import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { createDbPool } from './infrastructure/DB'
import { requireUser } from './features/auth/AuthMiddleware'
import { authRoutes } from './features/auth/AuthRouter'

async function main() {
  const pool = await createDbPool()
  const app = express()
  const port = process.env.PORT || 8081

  app.use(morgan('dev'))
  app.use(cors())
  app.use(express.json())
  app.use((req, _, next) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.env = {} as any
    req.env.pool = pool
    next()
  })

  app
    .get('/health-check', (_, res) => {
      res.json({ healthy: true })
    })
    .get('/me', requireUser, authRoutes.me)
    .post('/login', authRoutes.login)
    .post('/register', authRoutes.register)

  app.listen(port, () => {
    console.log(`App started successfully on ${port}!`)
  })
}

main()
