import { Pool } from 'pg'
import { withConn } from '../../infrastructure/DB'
import { Maybe } from 'purify-ts/Maybe'
import { User } from './User'

export interface InsertUserDTO {
  username: string
  email: string
  password: string
}

export const insertUser = (dto: InsertUserDTO, pool: Pool): Promise<void> =>
  withConn(pool, async conn => {
    await conn.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [dto.username, dto.email, dto.password]
    )
  })

export const findUserByUsername = (
  username: string,
  pool: Pool
): Promise<Maybe<User>> =>
  withConn(pool, conn =>
    conn
      .query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username])
      .then(res => Maybe.fromNullable(res.rows[0]))
  )

export const findUserByEmail = (
  email: string,
  pool: Pool
): Promise<Maybe<User>> =>
  withConn(pool, conn =>
    conn
      .query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email])
      .then(res => Maybe.fromNullable(res.rows[0]))
  )
