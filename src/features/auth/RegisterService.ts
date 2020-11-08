import { hash } from 'bcrypt'
import { Pool } from 'pg'
import { Codec, GetType, string } from 'purify-ts/Codec'
import { Either } from 'purify-ts/Either'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Maybe } from 'purify-ts/Maybe'
import { MaybeAsync } from 'purify-ts/MaybeAsync'
import { Env } from '../../infrastructure/Env'
import { generateJwt } from './LoginService'
import {
  findUserByEmail,
  findUserByUsername,
  insertUser,
  InsertUserDTO
} from './UserRepo'

export enum RegisterError {
  UserAlreadyExists = '003',
  InvalidRequest = '004',
  ValidationFailed = '005',
  PasswordHashingFailed = '006',
  TokenSigningFailed = '007',
  DbError = '008'
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
): EitherAsync<RegisterError, string | undefined> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const body = await liftEither(parseBody(rawBody))
    const dto = await liftEither(validateBody(body))

    await fromPromise(tryToInsertUser(dto, env.pool))

    const jwt = await liftEither(
      generateJwt(dto.username).mapLeft(
        err => (console.log(err) as never) || RegisterError.TokenSigningFailed
      )
    )

    return jwt
  })

const parseBody = (rawBody: unknown): Either<RegisterError, RegisterBody> =>
  RegisterBody.decode(rawBody).mapLeft(_ => RegisterError.InvalidRequest)

const tryToInsertUser = (dto: InsertUserDTO, pool: Pool) =>
  EitherAsync<RegisterError, void>(async ({ throwE }) => {
    const userExists = await doesUserAlreadyExist(dto, pool)

    if (userExists) {
      throwE(RegisterError.UserAlreadyExists)
    }
  })
    .chain(() =>
      hashPassword(dto.password).toEitherAsync(
        RegisterError.PasswordHashingFailed
      )
    )
    .chain(hashedPassword =>
      EitherAsync(() =>
        insertUser({ ...dto, password: hashedPassword }, pool)
      ).mapLeft(_ => RegisterError.DbError)
    )

const doesUserAlreadyExist = (
  dto: InsertUserDTO,
  pool: Pool
): Promise<boolean> =>
  Promise.all([
    findUserByUsername(dto.username, pool),
    findUserByEmail(dto.email, pool)
  ]).then(([maybeUser1, maybeUser2]) => maybeUser1.alt(maybeUser2).isJust())

const hashPassword = (password: string): MaybeAsync<string> =>
  MaybeAsync(() => hash(password, 10))

const validateBody = (
  body: RegisterBody
): Either<RegisterError, InsertUserDTO> =>
  validateUsername(body.username)
    .chain(username =>
      validateEmail(body.email).chain(email =>
        validatePassword(body.password).map(password => ({
          username,
          email,
          password
        }))
      )
    )
    .toEither(RegisterError.ValidationFailed)

const validateUsername = (username: string): Maybe<string> =>
  Maybe.of(username)
    .filter(x => x.length >= 4)
    .filter(x => x.length < 99)

const validateEmail = (email: string): Maybe<string> =>
  Maybe.of(email).filter(x => x.includes('@'))

const validatePassword = (password: string): Maybe<string> =>
  Maybe.of(password).filter(x => x.length >= 6)
