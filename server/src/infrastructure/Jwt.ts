/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from 'jsonwebtoken'
import { Request } from 'express'
import { Either } from 'purify-ts/Either'
import { CustomError } from 'ts-custom-error'
import { v4 as uuidv4 } from 'uuid'
import { ApplicationError } from './Error'
import { Maybe } from 'purify-ts/Maybe'

class JwtError extends CustomError implements ApplicationError {
  status = 500
  code = uuidv4()
  log = false
}

export const generateAccessToken = (username: string): string =>
  jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET!, {
    algorithm: 'HS256',
    issuer: 'example-app',
    expiresIn: '15m'
  })

export const generateRefreshToken = (username: string): string =>
  jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET!, {
    algorithm: 'HS256',
    issuer: 'example-app',
    expiresIn: '30d'
  })

export const verifyAccessToken = (
  token: string
): Either<JwtError, { username: string }> =>
  Either.encase(
    () => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as never
  ).mapLeft(err => new JwtError(err.message))

export const verifyRefreshToken = (
  token: string
): Either<JwtError, { username: string }> =>
  Either.encase(
    () => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as never
  ).mapLeft(err => new JwtError(err.message))

export const getAccessTokenFromRequest = (req: Request): Maybe<string> =>
  Maybe.fromNullable(req.header('Authorization')).chainNullable(x =>
    x.split(' ').pop()
  )
