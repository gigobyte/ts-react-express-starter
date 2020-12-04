import { compare, hash } from 'bcrypt'
import { EitherAsync } from 'purify-ts/EitherAsync'

export const comparePasswords = (
  hashedPassword: string,
  attempt: string
): EitherAsync<Error, boolean> =>
  EitherAsync(() => compare(hashedPassword, attempt))

export const hashPassword = (password: string): EitherAsync<Error, string> =>
  EitherAsync(() => hash(password, 10))
