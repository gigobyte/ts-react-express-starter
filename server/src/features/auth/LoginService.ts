import jwt from 'jsonwebtoken'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Codec, string, GetType } from 'purify-ts/Codec'
import { findUserByUsername } from './UserRepo'
import { Env } from '../../infrastructure/Env'
import { generateJwt } from '../../infrastructure/Jwt'
import { comparePasswords } from '../../infrastructure/Bcrypt'
import { identity } from 'purify-ts/Function'
import { User } from './User'
import { Right } from 'purify-ts/Either'

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
  EitherAsync.liftEither(
    LoginBody.decode(rawBody).mapLeft(_ => LoginError.InvalidRequest)
  )
    .chain(body =>
      findUserByUsername(body.username, env.pool)
        .mapLeft(_ => LoginError.DbError)
        .chain(async maybeUser => maybeUser.toEither(LoginError.UserNotFound))
        .chain<LoginError, User>(async user => {
          const compareResult = await comparePasswords(
            user.password,
            body.password
          )

          return compareResult.caseOf({
            Left: _ => {
              throw LoginError.TokenSigningFailed
            },
            Right: isSamePassword => {
              if (isSamePassword) {
                return Right(user)
              }

              throw LoginError.UserNotFound
            }
          })
        })
    )
    .map(user => generateJwt(user.username))
