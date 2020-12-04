import { User } from '../features/auth/User'
import { Pool } from 'pg'
import { Request, Response, NextFunction } from 'express'

export interface Env {
  user: User
  pool: Pool
}

export const initializeEnv = (pool: Pool | null) => (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  req.env = { pool } as never
  next()
}
