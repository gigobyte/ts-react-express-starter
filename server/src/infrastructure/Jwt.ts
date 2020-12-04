import jwt from 'jsonwebtoken'
import { Either } from 'purify-ts/Either'
import { jwtSecret } from './Secrets'

export const generateJwt = (username: string): string =>
  jwt.sign({ username }, jwtSecret, {
    algorithm: 'HS256',
    issuer: 'example-app'
  })

export const verifyJwt = (
  authHeader: string
): Either<jwt.VerifyErrors, string> =>
  Either.encase(() => jwt.verify(authHeader, jwtSecret) as string)
