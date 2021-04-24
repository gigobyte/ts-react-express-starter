import { EitherAsync } from 'purify-ts/EitherAsync'
import { Codec, string, GetType } from 'purify-ts/Codec'
import { findUserByUsername } from './UserRepo'
import { Env } from '../../infrastructure/Env'
import {
  generateAccessToken,
  generateRefreshToken
} from '../../infrastructure/Jwt'
import { comparePasswords } from '../../infrastructure/Bcrypt'
import { Left, Right } from 'purify-ts/Either'
import { CustomError } from 'ts-custom-error'
import { ApplicationError, InvalidRequest } from '../../infrastructure/Error'

class UserNotFound extends CustomError implements ApplicationError {
  status = 400
  code = 'UserNotFound'
  log = false
}

const LoginBody = Codec.interface({
  username: string,
  password: string
})

type LoginBody = GetType<typeof LoginBody>

export const login = (env: Env, rawBody: unknown) =>
  EitherAsync.liftEither(
    LoginBody.decode(rawBody).mapLeft(_ => new InvalidRequest())
  )
    .chain(body =>
      findUserByUsername(body.username, env.pool)
        .chain(async maybeUser => maybeUser.toEither(new UserNotFound()))
        .chain(user =>
          comparePasswords(
            user.password,
            body.password
          ).chain(async isSamePassword =>
            isSamePassword ? Right(user) : Left(new UserNotFound())
          )
        )
    )
    .map(user => ({
      accessToken: generateAccessToken(user.username),
      refreshToken: generateRefreshToken(user.username)
    }))
