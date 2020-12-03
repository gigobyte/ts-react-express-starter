import jwt from 'jsonwebtoken'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Codec, string, GetType } from 'purify-ts/Codec'
import { findUserByUsername } from './UserRepo'
import { Pool } from 'pg'
import { User } from './User'
import { compareSync } from 'bcrypt'
import { Either } from 'purify-ts/Either'
import { jwtSecret } from '../../infrastructure/Secrets'
import { Env } from '../../infrastructure/Env'

export enum LoginError {
  UserNotFound = '64381d48',
  InvalidRequest = '66514230',
  TokenSigningFailed = '6814139a',
  DbError = '69a9d53c'
}

const LoginBody = Codec.interface({
  username: string,
  password: string
})

type LoginBody = GetType<typeof LoginBody>

export const login = (
  env: Env,
  rawBody: unknown
): EitherAsync<LoginError, string> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const body = await liftEither(
      LoginBody.decode(rawBody).mapLeft(_ => LoginError.InvalidRequest)
    )

    const user = await fromPromise(findUserByCredentials(env.pool, body))

    const jwt = await liftEither(
      generateJwt(user.username).mapLeft(_ => LoginError.TokenSigningFailed)
    )

    return jwt
  })

const findUserByCredentials = (
  pool: Pool,
  body: LoginBody
): EitherAsync<LoginError, User> => {
  const isPasswordValid = (user: User) =>
    compareSync(user.password, body.password)

  return findUserByUsername(body.username, pool)
    .mapLeft(_ => LoginError.DbError)
    .chain(async maybeUser =>
      maybeUser.filter(isPasswordValid).toEither(LoginError.UserNotFound)
    )
}

export const generateJwt = (username: string): Either<Error, string> =>
  Either.encase(() =>
    jwt.sign({ username }, jwtSecret, {
      algorithm: 'HS256',
      issuer: 'example-app'
    })
  )
