import { Pool, PoolClient } from 'pg'
import { v4 as uuidv4 } from 'uuid'
import { migrate } from 'postgres-migrations'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { CustomError } from 'ts-custom-error'
import { ApplicationError } from './Error'
import { logger } from './Logger'

export class DBError extends CustomError implements ApplicationError {
  status = 500
  code = uuidv4()
  log = true
}

export const createDbPool = async (): Promise<Pool | null> => {
  const pool = new Pool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432
  })

  try {
    const client = await pool.connect()

    try {
      await migrate({ client }, 'sql')
    } finally {
      await client.release()
    }
  } catch {
    logger.error('Failed to connect to db')
    return null
  }

  return pool
}

export const withConn = <T>(
  pool: Pool,
  f: (conn: PoolClient) => Promise<T>
): EitherAsync<DBError, T> =>
  EitherAsync(async () => {
    const client = await pool.connect()

    try {
      return await f(client)
    } catch (e) {
      throw new DBError(e.message)
    } finally {
      await client.release()
    }
  })
