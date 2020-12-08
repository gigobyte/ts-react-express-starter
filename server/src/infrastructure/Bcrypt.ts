import { compare, hash } from 'bcrypt'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { CustomError } from 'ts-custom-error'
import { v4 as uuidv4 } from 'uuid'
import { ApplicationError } from './Error'

class BcryptError extends CustomError implements ApplicationError {
  status = 500
  code = uuidv4()
  log = true
}

export const comparePasswords = (
  hashedPassword: string,
  attempt: string
): EitherAsync<BcryptError, boolean> =>
  EitherAsync<Error, boolean>(() => compare(attempt, hashedPassword)).mapLeft(
    err => new BcryptError(err.message)
  )

export const hashPassword = (
  password: string
): EitherAsync<BcryptError, string> =>
  EitherAsync<Error, string>(() => hash(password, 10)).mapLeft(
    err => new BcryptError(err.message)
  )
