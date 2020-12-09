import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createDbPool } from './infrastructure/DB'
import { requireUser } from './features/auth/AuthMiddleware'
import { authRoutes } from './features/auth/AuthRouter'
import { initializeEnv } from './infrastructure/Env'

dotenv.config()

// https://github.com/microsoft/TypeScript/issues/41831
const prerequisites = [createDbPool(), Promise.resolve()] as const

Promise.all(prerequisites).then(([pool]) => {
  const app = express()
  const port = process.env.PORT || 8081

  app
    .use(morgan('dev'))
    .use(
      cors({
        credentials: true,
        origin: 'http://localhost:8080'
      })
    )
    .use(express.json())
    .use(cookieParser())
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
    .post('/logout', requireUser, authRoutes.logout)
    .post('/register', authRoutes.register)
    .post('/refresh-token', authRoutes.refreshToken)

  app.listen(port, () => {
    console.log(`App started successfully on ${port}!`)
  })
})
