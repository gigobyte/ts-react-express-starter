import { Pool } from 'pg'
import { Codec, GetType, string } from 'purify-ts/Codec'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Maybe } from 'purify-ts/Maybe'
import { hashPassword } from '../../infrastructure/Bcrypt'
import { Env } from '../../infrastructure/Env'
import { generateJwt } from '../../infrastructure/Jwt'
import {
  findUserByEmail,
  findUserByUsername,
  insertUser,
  InsertUserDTO
} from './UserRepo'

export enum RegisterError {
  UserAlreadyExists = '6dd3cd20',
  InvalidRequest = '6fc593de',
  ValidationFailed = '7196171a',
  PasswordHashingFailed = '7338cbc6',
  TokenSigningFailed = '74fe15b0',
  DbError = '76b28a8a'
}

const RegisterBody = Codec.interface({
  username: string,
  email: string,
  password: string
})

type RegisterBody = GetType<typeof RegisterBody>

export const register = (
  env: Env,
  rawBody: unknown
): EitherAsync<RegisterError, string> =>
  EitherAsync(async ({ liftEither }) => {
    const body = await liftEither(
      RegisterBody.decode(rawBody).mapLeft(_ => RegisterError.InvalidRequest)
    )

    const dto = await liftEither(
      validateBody(body).toEither(RegisterError.ValidationFailed)
    )

    await liftEither(await tryToInsertUser(dto, env.pool))

    return generateJwt(dto.username)
  })

const tryToInsertUser = (dto: InsertUserDTO, pool: Pool) =>
  doesUserAlreadyExist(dto, pool)
    .mapLeft(_ => RegisterError.DbError)
    .ifRight(userExists => {
      if (userExists) {
        throw RegisterError.UserAlreadyExists
      }
    })
    .chain(() =>
      hashPassword(dto.password).mapLeft(
        _ => RegisterError.PasswordHashingFailed
      )
    )
    .chain(hashedPassword =>
      insertUser({ ...dto, password: hashedPassword }, pool).mapLeft(
        _ => RegisterError.DbError
      )
    )

const doesUserAlreadyExist = (
  dto: InsertUserDTO,
  pool: Pool
): EitherAsync<Error, boolean> =>
  findUserByUsername(dto.username, pool)
    .alt(findUserByEmail(dto.email, pool))
    .map(x => x.isJust())

const validateBody = (body: RegisterBody): Maybe<InsertUserDTO> => {
  const validateUsername = (username: string): Maybe<string> =>
    Maybe.of(username)
      .filter(x => x.length >= 4)
      .filter(x => x.length < 99)

  const validateEmail = (email: string): Maybe<string> =>
    Maybe.of(email).filter(x => x.includes('@'))

  const validatePassword = (password: string): Maybe<string> =>
    Maybe.of(password).filter(x => x.length >= 6)

  return validateUsername(body.username).chain(username =>
    validateEmail(body.email).chain(email =>
      validatePassword(body.password).map(password => ({
        username,
        email,
        password
      }))
    )
  )
}
