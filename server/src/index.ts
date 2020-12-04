import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { createDbPool } from './infrastructure/DB'
import { requireUser } from './features/auth/AuthMiddleware'
import { authRoutes } from './features/auth/AuthRouter'
import { initializeEnv } from './infrastructure/Env'

const prerequisites = [createDbPool()]

Promise.all(prerequisites).then(([pool]) => {
  const app = express()
  const port = process.env.PORT || 8081

  app
    .use(morgan('dev'))
    .use(cors())
    .use(express.json())
    .get('/health', (_, res) => {
      if (pool) {
        res.status(200).json({ status: 'healthy' })
      } else {
        res.status(503).json({ status: 'unavailable' })
      }
    })
    .use(initializeEnv(pool))
    .get('/me', requireUser, authRoutes.me)
    .post('/login', authRoutes.login)
    .post('/register', authRoutes.register)

  app.listen(port, () => {
    console.log(`App started successfully on ${port}!`)
  })
})
