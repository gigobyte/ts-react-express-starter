import { Pool } from 'pg'
import { Codec, GetType, string } from 'purify-ts/Codec'
import { Left, Right } from 'purify-ts/Either'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Maybe } from 'purify-ts/Maybe'
import { CustomError } from 'ts-custom-error'
import { hashPassword } from '../../infrastructure/Bcrypt'
import { Env } from '../../infrastructure/Env'
import {
  ApplicationError,
  InvalidRequest,
  ValidationFailed
} from '../../infrastructure/Error'
import {
  findUserByEmail,
  findUserByUsername,
  insertUser,
  InsertUserDTO
} from './UserRepo'

class UserAlreadyExists extends CustomError implements ApplicationError {
  status = 400
  code = 'UserAlreadyExists'
  log = false
}

const RegisterBody = Codec.interface({
  username: string,
  email: string,
  password: string
})

type RegisterBody = GetType<typeof RegisterBody>

export const register = (env: Env, rawBody: unknown) =>
  EitherAsync.liftEither(
    RegisterBody.decode(rawBody).mapLeft(_ => new InvalidRequest())
  )
    .chain(async body => validateBody(body).toEither(new ValidationFailed()))
    .chain(dto => tryToInsertUser(dto, env.pool).map(_ => dto))
    .map<void>(_ => undefined)

const tryToInsertUser = (dto: InsertUserDTO, pool: Pool) =>
  findUserByUsername(dto.username, pool)
    .alt(findUserByEmail(dto.email, pool))
    .chain(async maybeUser =>
      maybeUser.caseOf({
        Just: _ => Left(new UserAlreadyExists()),
        Nothing: () => Right(maybeUser)
      })
    )
    .chain(() => hashPassword(dto.password))
    .chain(hashedPassword =>
      insertUser({ ...dto, password: hashedPassword }, pool)
    )

const validateBody = (body: RegisterBody): Maybe<InsertUserDTO> =>
  Maybe.of(body)
    .filter(x => x.username.length >= 4)
    .filter(x => x.username.length < 99)
    .filter(x => x.email.includes('@'))
    .filter(x => x.password.length >= 6)
    .map(x => ({ username: x.username, password: x.password, email: x.email }))
