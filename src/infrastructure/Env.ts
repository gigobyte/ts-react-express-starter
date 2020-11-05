import { User } from '../features/auth/User'
import { Pool } from 'pg'

export interface Env {
  user: User
  pool: Pool
}
