import jwt from 'jsonwebtoken'
import { Either } from 'purify-ts/Either'
import { CustomError } from 'ts-custom-error'
import { v4 as uuidv4 } from 'uuid'
import { ApplicationError } from './Error'
import { jwtSecret } from './Secrets'

class JwtError extends CustomError implements ApplicationError {
  status = 500
  code = uuidv4()
  log = true
}

export const generateJwt = (username: string): string =>
  jwt.sign({ username }, jwtSecret, {
    algorithm: 'HS256',
    issuer: 'example-app'
  })

export const verifyJwt = (authHeader: string): Either<JwtError, string> =>
  Either.encase(() => jwt.verify(authHeader, jwtSecret) as string).mapLeft(
    err => new JwtError(err.message)
  )
