import { Pool, PoolClient } from 'pg'
import { migrate } from 'postgres-migrations'
import { logger } from './Logger'
import { dbPassword } from './Secrets'

export const createDbPool = async (): Promise<Pool | null> => {
  const pool = new Pool({
    database: 'exampledb',
    user: 'postgres',
    password: dbPassword,
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

export const withConn = async <T>(
  pool: Pool,
  f: (conn: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect()

  try {
    return await f(client)
  } finally {
    await client.release()
  }
}
