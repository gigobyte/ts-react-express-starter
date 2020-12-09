import { Pool } from 'pg'
import { DBError, withConn } from '../../infrastructure/DB'
import { Maybe } from 'purify-ts/Maybe'
import { User } from './User'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { List } from 'purify-ts/List'

export interface InsertUserDTO {
  username: string
  email: string
  password: string
}

export const insertUser = (
  dto: InsertUserDTO,
  pool: Pool
): EitherAsync<DBError, void> =>
  withConn(pool, async conn => {
    await conn.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [dto.username, dto.email, dto.password]
    )
  })

export const findUserByUsername = (
  username: string,
  pool: Pool
): EitherAsync<DBError, Maybe<User>> =>
  withConn(pool, conn =>
    conn
      .query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username])
      .then(res => List.at(0, res.rows))
  )

export const findUserByEmail = (
  email: string,
  pool: Pool
): EitherAsync<DBError, Maybe<User>> =>
  withConn(pool, conn =>
    conn
      .query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email])
      .then(res => List.at(0, res.rows))
  )
